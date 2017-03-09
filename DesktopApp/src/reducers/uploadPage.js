import * as types from '../actions'

const initialState = {
  stepper: 0
}

export default function uploadPage (state = initialState, action = {}) {
  const {
    payload
  } = action

  switch (action.type) {
    case types.CHANGESTEPPER:
      return {
        ...state,
        stepper: payload.value
      }
    default:
      return state
  }
}
