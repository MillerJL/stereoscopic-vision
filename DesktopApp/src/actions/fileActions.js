import * as types from './index'
var remote = window.require('electron').remote
var electronFs = remote.require('fs')

function getFileType (type, name) {
  let fileType = 'unknown'
  if (type.match(/video/g)) fileType = 'video'
  if (name.match(/.fit/g)) fileType = 'fit'

  return fileType
}

export function addLeftFile (file) {
  return {
    type: types.ADDLEFTFILE,
    payload: {
      name: file.name,
      path: file.path,
      fileSize: electronFs.statSync(file.path)['size'] / 1000000.0,
      fileType: getFileType(file.type, file.name)
    }
  }
}

export function removeLeftFile (file) {
  return {
    type: types.REMOVELEFTFILE,
    payload: { file }
  }
}

export function addRightFile (file) {
  return {
    type: types.ADDRIGHTFILE,
    payload: {
      name: file.name,
      path: file.path,
      fileSize: electronFs.statSync(file.path)['size'] / 1000000.0,
      fileType: getFileType(file.type, file.name)
    }
  }
}

export function removeRightFile (file) {
  return {
    type: types.REMOVERIGHTFILE,
    payload: { file }
  }
}
