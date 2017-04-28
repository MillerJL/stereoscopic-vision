import * as types from './index'

export function toggleDialog (toggle) {
  return {
    type: types.TOGGLEDIRECTORYSELECT
  }
}

export function directorySelect ({ path }) {
  return {
    type: types.DIRECTORYSELECT,
    payload: {
      path
    }
  }
}

export function updateFileName ({ fileName }) {
  return {
    type: types.UPDATEFILENAME,
    payload: {
      fileName
    }
  }
}
