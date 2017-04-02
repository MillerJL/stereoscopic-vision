import * as types from './index'
import {
  addErrors,
  toggleErrorAlert
} from './errorActions'
import {
  toggleEditStep
} from './uploadPageActions'

var remote = window.require('electron').remote
var electronFs = remote.require('fs')

// console.log(remote.app.getPath('documents'))
// const spawn = remote.require('child_process').spawn
// const ls = spawn('/Users/johnmiller/School/capstone/test/videoStuff/a.out')
//
// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`)
// })
//
// ls.stderr.on('data', (data) => {
//   console.log(`stderr: ${data}`)
// })
//
// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`)
// })

function getFileType (type, name) {
  if (type.match(/video/g)) return 'video'
  else if (name.match(/.fit/g)) return 'fit'
  else return type || 'unknown'
}

export function validateAddFile ({ files, side }) {
  return (dispatch, getState) => {
    let errors = []

    files.forEach(file => {
      let error = []
      const payload = {
        name: file.name,
        path: file.path,
        size: electronFs.statSync(file.path)['size'] / 1000000.0,
        type: getFileType(file.type, file.name)
      }

      let fileSide = (side === 'left')
        ? 'leftFileList'
        : 'rightFileList'

      if (getState().file[fileSide].length + 1 > 2) {
        error.push({
          message: 'Only a .fit and video file are required for each side',
          file: file.name
        })
      }
      if (getState().file[fileSide].map(item => { return item.type }).includes(payload.type)) {
        error.push({
          message: 'You have already selected a ' + payload.type + ' file',
          file: file.name
        })
      } else if (!['video', 'fit'].includes(payload.type)) {
        error.push({
          message: 'File type ' + payload.type + ' is not allowed',
          file: file.name
        })
      }

      if (!error.length) {
        (side === 'left')
          ? dispatch(addLeftFile(file, payload))
          : dispatch(addRightFile(file, payload))
      } else {
        errors.push(...error)
      }
    })
    if (errors.length > 0) {
      dispatch(addErrors(errors))
      dispatch(toggleErrorAlert())
    }
    dispatch(validateFileState())
  }
}

export function addLeftFile (file, payload) {
  return {
    type: types.ADDLEFTFILE,
    payload
  }
}

export function addRightFile (file, payload) {
  return {
    type: types.ADDRIGHTFILE,
    payload
  }
}

export function removeFile ({ side, file }) {
  return (dispatch, getState) => {
    let removeFunction = (side === 'left')
      ? removeLeftFile
      : removeRightFile
    dispatch(removeFunction({ file }))
    dispatch(validateFileState())
  }
}

export function removeLeftFile ({ file }) {
  return {
    type: types.REMOVELEFTFILE,
    payload: { file }
  }
}

export function removeRightFile ({ file }) {
  return {
    type: types.REMOVERIGHTFILE,
    payload: { file }
  }
}

export function validateFileState () {
  return (dispatch, getState) => {
    if (getState().file.leftFileList.length === 2 && getState().file.rightFileList.length === 2) {
      dispatch(toggleEditStep({ disabled: false }))
    } else {
      if (!getState().uploadPage.editStep.disabled) dispatch(toggleEditStep({ disabled: true }))
    }
  }
}
