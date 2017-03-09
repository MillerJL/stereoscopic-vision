import * as types from './index'

export function addErrors (errors) {
  return {
    type: types.ADDERRORS,
    payload: {
      errors
    }
  }
}

export function toggleErrorAlert (toggle) {
  return {
    type: types.TOGGLEERRORALERT
  }
}
