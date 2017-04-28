import path from 'path'
import * as types from './index'

const remote = window.require('electron').remote
const spawn = remote.require('child_process').spawn

export function updateProgressBar ({ progress = 0 }) {
  return {
    type: types.UPDATEPROGRESSBAR,
    payload: {
      progress
    }
  }
}

export function changeProgressBarColor ({ color }) {
  return {
    type: types.CHANGEPROGRESSBARCOLOR,
    payload: {
      color
    }
  }
}

export function toggleProcessButton () {
  return {
    type: types.TOGGLEPROCESSBUTTON
  }
}

async function preStabilize ({ vid, out, dispatch, updateBar, updateColor }) {
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
    console.log(data)
    // dispatch(updateBar())
  })

  stab.on('close', (code) => {
    console.log(code)
    // dispatch(updateColor({ color: '#8BC34A' }))
    // dispatch(updateBar({ progress: 100 }))

    return out
  })
}

async function stabilize ({ vid, trf, out, dispatch, updateBar, updateColor }) {
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
    console.log(data)
    // dispatch(updateBar())
  })

  stab.on('close', (code) => {
    console.log(code)
    // dispatch(updateColor({ color: '#8BC34A' }))
    // dispatch(updateBar({ progress: 100 }))

    return out
  })
}

export function process () {
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

    let stab1Pre = await preStabilize({
      vid: files.leftVideo,
      out: '/Users/johnmiller/School/capstone/test/videoStuff/tempout1.trf',
      dispatch,
      updateBar: 'ayy',
      updateColor: 'lmao'
    })
    let stab1 = await stabilize({
      vid: files.leftVideo,
      trf: stab1Pre,
      out: '/Users/johnmiller/School/capstone/test/videoStuff/stab1.mp4',
      dispatch,
      updateBar: 'ayy',
      updateColor: 'lmao'
    })

    // let stab2Pre = await preStabilize({
    //   vid: files.leftVideo,
    //   out: '/Users/johnmiller/School/capstone/test/videoStuff/tempout1.trf',
    //   dispatch,
    //   updateBar: 'ayy',
    //   updateColor: 'lmao'
    // })
    // let stab1 = await stabilize({
    //   vid: files.leftVideo,
    //   trf: stab2Pre,
    //   out: '/Users/johnmiller/School/capstone/test/videoStuff/stab1.mp4',
    //   dispatch,
    //   updateBar: 'ayy',
    //   updateColor: 'lmao'
    // })

    // dispatch(stabilizeVideo1({ files, edit }))
    const ls = spawn('ffmpeg', [
      '-i',
      files.leftVideo.path,
      '-i',
      files.rightVideo.path,
      '-filter_complex',
      '[0:v:0]pad=iw*2:ih[bg]; [bg][1:v:0]overlay=w',
      path.join(edit.directory, edit.fileName)
    ])

    // I wish progress printed to here. Maybe some ffmpeg flag will help...
    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    // Errors and progress
    ls.stderr.on('data', (data) => {
      let temp = ''

      data.forEach(character => {
        temp += String.fromCharCode(character)
      })
      if (temp.includes('frame= ')) {
        // Potentially cleaner solution, not working right now
        // let regex = new RegExp('^frame=\s*(.*?)\s*fps=\s*(.*?)\s*q=\s*(.*?)\s*size=\s*(.*?)\s*time=\s*(.*?)\s*bitrate=\s*(.*?)\s*speed=\s*(.*?)\s*$')

        temp = temp.replace(/\s+/g, ' ')
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
        let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
        let progress = parseInt((seconds / files.leftVideo.duration) * 100)

        dispatch(updateProgressBar({ progress }))
      }
    })

    // Done
    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`)

      dispatch(changeProgressBarColor({ color: '#8BC34A' }))
      dispatch(updateProgressBar({ progress: 100 }))
    })
  }
}
