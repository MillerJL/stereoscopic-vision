import * as types from '../actions'

const initialState = {
  errorMessages: [],
  errorAlert: false
}

export default function file (state = initialState, action = {}) {
  switch (action.type) {
    case types.ADDERRORS:
      return {
        ...state,
        errorMessages: [
          ...action.payload.errors
        ]
      }
    case types.TOGGLEERRORALERT:
      return {
        ...state,
        errorAlert: !state.errorAlert
      }
    case types.OPENERRORALERT:
      return {
        ...state,
        errorAlert: true
      }
    default:
      return state
  }
}
