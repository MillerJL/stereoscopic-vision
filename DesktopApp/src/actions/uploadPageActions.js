import * as types from './index'

export function changeStepper (value) {
  return {
    type: types.CHANGESTEPPER,
    payload: {
      value
    }
  }
}

export function toggleEditStep ({ disabled }) {
  return {
    type: types.TOGGLEEDITSTEP,
    payload: {
      disabled
    }
  }
}

export function toggleProcessStep ({ disabled }) {
  return {
    type: types.TOGGLEPREVIOUSSTEP,
    payload: {
      disabled
    }
  }
}
