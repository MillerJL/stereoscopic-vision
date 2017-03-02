import * as types from '../actions'

const initialState = {
  leftFileList: [],
  rightFileList: []
}

export default function file (state = initialState, action = {}) {
  const { leftFileList, rightFileList } = state
  const { payload } = action

  switch (action.type) {
    case types.ADDLEFTFILE:
      return {
        ...state,
        leftFileList: [
          ...state.leftFileList,
          {
            name: payload.name,
            path: payload.path,
            size: payload.fileSize,
            type: payload.fileType
          }
        ]
      }
    case types.REMOVELEFTFILE:
      return {
        ...state,
        leftFileList: [
          ...leftFileList.slice(0, payload.file),
          ...leftFileList.slice(payload.file + 1, leftFileList.length)
        ]
      }
    case types.ADDRIGHTFILE:
      return {
        ...state,
        rightFileList: [
          ...state.rightFileList,
          {
            name: payload.name,
            path: payload.path,
            size: payload.fileSize,
            type: payload.fileType
          }
        ]
      }
    case types.REMOVERIGHTFILE:
      return {
        ...state,
        rightFileList: [
          ...rightFileList.slice(0, payload.file),
          ...rightFileList.slice(payload.file + 1, rightFileList.length)
        ]
      }
    default:
      return state
  }
}
