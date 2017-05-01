import path from 'path'
import * as types from './index'
import { addErrors, toggleErrorAlert } from './errorActions'

const remote = window.require('electron').remote
const spawn = remote.require('child_process').spawn
const electronFs = remote.require('fs')

import { hashHistory } from 'react-router'

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

export function displayResetButton () {
  return {
    type: types.DISPLAYRESETBUTTON
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
    if (electronFs.existsSync(out)) {
      electronFs.unlink(out, err => {
        if (err) console.log(err)
        return
      })
    }

    let logs = []

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
      // console.log(`stdout: ${data}`)
    })

    stab.stderr.on('data', (data) => {
      // console.log(`stderr: ${data}`)

      let output = decodeOutput({ data })
      logs.push({ message: output })

      if (output.includes('frame= ')) {
        let progress = parseInt((getTime({ output }) / vid.duration) * 100, 10)

        dispatch(bar({ progress }))
      }
    })

    stab.on('close', (code) => {
      // console.log(code)
      if (code === 0) {
        dispatch(bar({ progress: 100, color: '#8BC34A', step: 2 }))
        resolve(out)
      } else {
        reject(logs)
      }
    })
  })
}

function stabilize ({ vid, trf, out, dispatch, bar }) {
  return new Promise((resolve, reject) => {
    if (electronFs.existsSync(out)) {
      electronFs.unlink(out, err => {
        if (err) console.log(err)
        return
      })
    }

    let logs = []

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
      // console.log(`stdout: ${data}`)
    })

    stab.stderr.on('data', (data) => {
      // console.log(`stderr: ${data}`)

      let output = decodeOutput({ data })
      logs.push({ message: output })

      if (output.includes('frame= ')) {
        let progress = parseInt((getTime({ output }) / vid.duration) * 100, 10)

        dispatch(bar({ progress, step: 2 }))
      }
    })

    stab.on('close', (code) => {
      // console.log(code)
      if (code === 0) {
        dispatch(bar({ progress: 100, color: '#8BC34A', step: 2 }))

        resolve({
          path: out,
          trf,
          duration: vid.duration,
          name: vid.name
        })
      } else {
        reject(logs)
      }
    })
  })
}

function combineVideos ({ leftVideo, rightVideo, out, dispatch, bar }) {
  return new Promise((resolve, reject) => {
    let logs = []

    if (electronFs.existsSync(out)) {
      reject([{ message: 'Output file already exists', file: out }])
    } else {
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
        // console.log(`stdout: ${data}`)
      })

      ls.stderr.on('data', (data) => {
        // console.log(`stderr: ${data}`)
        let output = decodeOutput({ data })
        logs.push({ message: output })

        if (output.includes('frame= ')) {
          let progress = parseInt((getTime({ output }) / leftVideo.duration) * 100, 10)

          dispatch(bar({ progress }))
        }
      })

      ls.on('close', (code) => {
        if (code === 0) {
          dispatch(updateProgressBar({ progress: 100, color: '#8BC34A' }))
          resolve(out)
        } else {
          reject(logs)
        }
      })
    }
  })
}

function cleanup ({ file }) {
  return new Promise((resolve, reject) => {
    electronFs.unlink(file.path, err => {
      if (err) reject(err)
      else {
        electronFs.unlink(file.trf, err => {
          if (err) reject(err)
          else resolve(null)
        })
      }
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

    let temp = remote.app.getPath('temp').replace(/C:\\/g, '/').replace(/\\/g, '/')

    let stabVideos = [
      preStabilize({
        vid: files.leftVideo,
        out: path.join(temp, 'preStabLeft.trf'),
        dispatch,
        bar: updateLeftProgressBar
      }).then(trf => {
        return stabilize({
          vid: files.leftVideo,
          trf,
          out: path.join(temp, 'stabLeft.mp4'),
          dispatch,
          bar: updateLeftProgressBar
        })
      }),
      preStabilize({
        vid: files.rightVideo,
        out: path.join(temp, 'preStabRight.trf'),
        dispatch,
        bar: updateRightProgressBar
      }).then(trf => {
        return stabilize({
          vid: files.rightVideo,
          trf,
          out: path.join(temp, 'stabRight.mp4'),
          dispatch,
          bar: updateRightProgressBar
        })
      })
    ]

    try {
      let results = await Promise.all(stabVideos)
      await combineVideos({
        leftVideo: results[0],
        rightVideo: results[1],
        out: path.join(edit.directory, edit.fileName),
        dispatch,
        bar: updateProgressBar
      })
      await Promise.all(results.map(file => {
        return cleanup({
          file
        })
      }))
      hashHistory.push('/review')
    } catch (e) {
      let err

      if (Array.isArray(e)) err = e
      else if (e.message) err = [e]
      else err = [{ message: e }]
      dispatch(addErrors(err))
      dispatch(toggleErrorAlert())
      dispatch(toggleProcessButton())
    }
  }
}

export function reset () {
  return {
    type: types.PROCESSRESET
  }
}
