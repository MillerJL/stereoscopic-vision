import * as types from '../actions'
// import os from 'os'
// console.log(os.tmpDir())

const initialState = {
  dialogOpen: false,
  directory: 'ayy'
}

export default function directorySelect (state = initialState, action = {}) {
  switch (action.type) {
    case types.TOGGLEDIRECTORYSELECT:
      return {
        ...state,
        dialogOpen: !state.dialogOpen
      }
    default:
      return state
  }
}
