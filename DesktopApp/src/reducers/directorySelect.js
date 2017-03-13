import * as types from '../actions'

const initialState = {
  dialogOpen: false
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
