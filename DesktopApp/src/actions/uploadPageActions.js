import * as types from './index'

export function changeStepper (value) {
  return {
    type: types.CHANGESTEPPER,
    payload: {
      value
    }
  }
}
