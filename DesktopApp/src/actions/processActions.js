import path from 'path'
import * as types from './index'

const remote = window.require('electron').remote
const spawn = remote.require('child_process').spawn

export function updateProgressBar ({ progress = 0, color = 'rgb(0, 188, 212)' }) {
  return {
    type: types.UPDATEPROGRESSBAR,
    payload: {
      progress,
      color
    }
  }
}

export function updateLeftProgressBar ({ progress = 0, color = 'rgb(0, 188, 212)', step = 1 }) {
  return {
    type: types.UPDATELEFTPROGRESSBAR,
    payload: {
      progress,
      color,
      step
    }
  }
}

export function updateRightProgressBar ({ progress = 0, color = 'rgb(0, 188, 212)', step = 1 }) {
  return {
    type: types.UPDATERIGHTPROGRESSBAR,
    payload: {
      progress,
      color,
      step
    }
  }
}

export function toggleProcessButton () {
  return {
    type: types.TOGGLEPROCESSBUTTON
  }
}

function decodeOutput ({ data }) {
  let temp = ''

  data.forEach(character => {
    temp += String.fromCharCode(character)
  })

  return temp
}

function getTime ({ output }) {
  let temp = output.replace(/\s+/g, ' ')
  .replace(/=\s+/g, '=')
  .split(' ')
  .filter(Boolean)
  .reduce((acc, item) => {
    let keyVal
    keyVal = item.split('=')
    acc[keyVal[0]] = keyVal[1]

    return acc
  }, {})
  let a = temp.time.split(':')

  return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
}

function preStabilize ({ vid, out, dispatch, bar }) {
  return new Promise((resolve, reject) => {
    const stab = spawn('ffmpeg', [
      '-i',
      vid.path,
      '-vf',
      'vidstabdetect=stepsize=6:shakiness=8:accuracy=9:result=' + out,
      '-f',
      'null',
      '-'
    ])

    stab.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    stab.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)

      let output = decodeOutput({ data })

      if (output.includes('frame= ')) {
        let progress = parseInt((getTime({ output }) / vid.duration) * 100, 10)

        dispatch(bar({ progress }))
      }
    })

    stab.on('close', (code) => {
      console.log(code)
      dispatch(bar({ progress: 100, color: '#8BC34A', step: 2 }))

      resolve(out)
    })
  })
}

function stabilize ({ vid, trf, out, dispatch, bar }) {
  return new Promise((resolve, reject) => {
    const stab = spawn('ffmpeg', [
      '-i',
      vid.path,
      '-vf',
      'vidstabtransform=input=' + trf + ':zoom=1:smoothing=30,unsharp=5:5:0.8:3:3:0.4',
      '-vcodec',
      'libx264',
      '-preset',
      'slow',
      '-tune',
      'film',
      '-crf',
      '18',
      '-acodec',
      'copy',
      out,
      '-f',
      'null',
      '-'
    ])

    stab.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    stab.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)

      let output = decodeOutput({ data })

      if (output.includes('frame= ')) {
        let progress = parseInt((getTime({ output }) / vid.duration) * 100, 10)

        dispatch(bar({ progress, step: 2 }))
      }
    })

    stab.on('close', (code) => {
      console.log(code)
      dispatch(bar({ progress: 100, color: '#8BC34A' }))

      resolve({
        path: out,
        duration: vid.duration,
        name: vid.name
      })
    })
  })
}

function combineVideos ({ leftVideo, rightVideo, out, dispatch, bar }) {
  return new Promise((resolve, reject) => {
    const ls = spawn('ffmpeg', [
      '-i',
      leftVideo.path,
      '-i',
      rightVideo.path,
      '-filter_complex',
      '[0:v:0]pad=iw*2:ih[bg]; [bg][1:v:0]overlay=w',
      out
    ])

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
      let output = decodeOutput({ data })

      if (output.includes('frame= ')) {
        let progress = parseInt((getTime({ output }) / leftVideo.duration) * 100, 10)

        dispatch(bar({ progress }))
      }
    })

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`)

      dispatch(updateProgressBar({ progress: 100, color: '#8BC34A' }))
    })
  })
}

export function process ({ tmpDir }) {
  return async (dispatch, getState) => {
    let {
      file,
      edit
    } = getState()

    dispatch(toggleProcessButton())

    let files = {
      leftVideo: file.leftFileList.filter(item => {
        return item.type === 'video'
      })[0],
      rightVideo: file.rightFileList.filter(item => {
        return item.type === 'video'
      })[0]
    }

    let stabVideos = [
      preStabilize({
        vid: files.leftVideo,
        out: '/tmp/preStabLeft.trf',
        dispatch,
        bar: updateLeftProgressBar
      }).then(trf => {
        return stabilize({
          vid: files.leftVideo,
          trf,
          out: '/tmp/stabLeft.mp4',
          dispatch,
          bar: updateLeftProgressBar
        })
      }),
      preStabilize({
        vid: files.rightVideo,
        out: '/tmp/preStabRight.trf',
        dispatch,
        bar: updateRightProgressBar
      }).then(trf => {
        return stabilize({
          vid: files.rightVideo,
          trf,
          out: '/tmp/stabRight.mp4',
          dispatch,
          bar: updateRightProgressBar
        })
      })
    ]

    let results = await Promise.all(stabVideos)
    console.log(results)
    let combVids = await combineVideos({
      leftVideo: results[0],
      rightVideo: results[1],
      out: path.join(edit.directory, edit.fileName),
      dispatch,
      bar: updateProgressBar
    })
    console.log(combVids)
  }
}
