import * as types from './index'
import {
  addErrors,
  toggleErrorAlert
} from './errorActions'
var remote = window.require('electron').remote
var electronFs = remote.require('fs')

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
      const state = getState()
      const payload = {
        name: file.name,
        path: file.path,
        size: electronFs.statSync(file.path)['size'] / 1000000.0,
        type: getFileType(file.type, file.name)
      }

      let fileSide = (side === 'left')
        ? state.file.leftFileList
        : state.file.rightFileList

      if (fileSide.length + 1 > 2) {
        error.push({
          message: 'Only a .fit and video file are required for each side',
          file: file.name
        })
      }
      if (fileSide.map(item => { return item.type }).includes(payload.type)) {
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
  }
}

export function addLeftFile (file, payload) {
  return {
    type: types.ADDLEFTFILE,
    payload
  }
}

export function removeLeftFile (file) {
  return {
    type: types.REMOVELEFTFILE,
    payload: { file }
  }
}

export function addRightFile (file, payload) {
  return {
    type: types.ADDRIGHTFILE,
    payload
  }
}

export function removeRightFile (file) {
  return {
    type: types.REMOVERIGHTFILE,
    payload: { file }
  }
}
