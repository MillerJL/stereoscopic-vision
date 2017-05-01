import * as types from '../actions'
import os from 'os'
var remote = window.require('electron').remote

const initialState = {
  dialogOpen: false,
  fileName: 'output_name.mp4',
  directory: remote.app.getPath('documents') || 'Download Directory',
  tempDirectory: os.tmpDir()
}

export default function edit (state = initialState, action = {}) {
  switch (action.type) {
    case types.TOGGLEDIRECTORYSELECT:
      return {
        ...state,
        dialogOpen: !state.dialogOpen
      }
    case types.DIRECTORYSELECT:
      return {
        ...state,
        directory: action.payload.path
      }
    case types.UPDATEFILENAME:
      return {
        ...state,
        fileName: action.payload.fileName
      }
    case types.EDITRESET:
      return {
        dialogOpen: false,
        fileName: 'output_name.mp4',
        directory: remote.app.getPath('documents') || 'Download Directory',
        tempDirectory: os.tmpDir()
      }
    default:
      return state
  }
}
