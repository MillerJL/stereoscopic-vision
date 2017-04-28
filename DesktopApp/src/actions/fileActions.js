import * as types from './index'
import { addErrors, toggleErrorAlert } from './errorActions'
import { toggleEditStep } from './uploadPageActions'
import { maxFileSize } from '../constants'

const remote = window.require('electron').remote
const electronFs = remote.require('fs')
const exec = remote.require('child_process').exec

function getFileType ({ type, name }) {
  if (type.match(/video/g)) return 'video'
  else if (name.match(/.fit/g)) return 'fit'
  else return type || 'unknown'
}

function getVideoDuration ({ filePath }) {
  return new Promise((resolve, reject) => {
    exec('ffprobe -v error -show_format -show_streams -i ' +
    filePath, (e, stdout, stderr) => {
      if (stderr) reject(stderr)
      let out = stdout.toString('utf8')
      let matched = out.match(/duration="?(\d*\.\d*)"?/)

      resolve(parseFloat(matched[1]))
    })
  })
}

// 18553418184

export function validateAddFile ({ files, side }) {
  return (dispatch, getState) => {
    let errors = []

    files.forEach(file => {
      let error = []
      console.log(electronFs.statSync(file.path))
      const payload = {
        name: file.name,
        path: file.path,
        size: electronFs.statSync(file.path)['size'] / 1000000.0,
        type: getFileType({ type: file.type, name: file.name })
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
      if (getState().file[fileSide].map(item => {
        return item.type
      }).includes(payload.type)) {
        error.push({
          message: 'You have already selected a ' + payload.type + ' file',
          file: file.name
        })
      } else if (!['video', 'fit'].includes(payload.type)) {
        error.push({
          message: 'File type ' + payload.type + ' is not allowed',
          file: file.name
        })
      } else if (payload.size > maxFileSize) {
        error.push({
          message: 'File too large, maximum size of ' + maxFileSize + 'MB allowed',
          file: file.name
        })
      }

      console.log(payload.size)
      console.log(maxFileSize)

      if (!error.length) dispatch(addFile({ file, side, payload }))
      else errors.push(...error)
    })
    if (errors.length > 0) {
      dispatch(addErrors(errors))
      dispatch(toggleErrorAlert())
    }
  }
}

export function addFile ({ file, side, payload }) {
  return (dispatch, getState) => {
    if (payload.type === 'video') {
      getVideoDuration({ filePath: file.path }).then(duration => {
        payload.duration = duration

        ;(side === 'left')
          ? dispatch(addLeftFile({ file, payload }))
          : dispatch(addRightFile({ file, payload }))
        dispatch(validateFileState())
      }).catch(err => {
        console.log(err)
      })
    } else {
      (side === 'left')
        ? dispatch(addLeftFile({ file, payload }))
        : dispatch(addRightFile({ file, payload }))
      dispatch(validateFileState())
    }
  }
}

export function addLeftFile ({ file, payload }) {
  return {
    type: types.ADDLEFTFILE,
    payload
  }
}

export function addRightFile ({ file, payload }) {
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
    if (getState().file.leftFileList.length === 1 &&
    getState().file.rightFileList.length === 1) {
      dispatch(toggleEditStep({ disabled: false }))
    } else {
      if (!getState().uploadPage.editStep.disabled) {
        dispatch(toggleEditStep({ disabled: true }))
      }
    }
  }
}
