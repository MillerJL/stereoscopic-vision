import * as types from '../actions'

const initialState = {
  stepper: 0,
  uploadStep: {
    disabled: false
  },
  editStep: {
    disabled: false
  },
  processStep: {
    disabled: false
  }
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
    case types.TOGGLEEDITSTEP:
      return {
        ...state,
        editStep: {
          disabled: payload.disabled
        }
      }
    case types.UPLOADPAGERESET:
      return {
        stepper: 0,
        uploadStep: {
          disabled: false
        },
        editStep: {
          disabled: false
        },
        processStep: {
          disabled: false
        }
      }
    default:
      return state
  }
}
