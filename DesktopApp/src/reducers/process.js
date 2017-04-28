import * as types from '../actions'

const initialState = {
  leftFileList: [],
  rightFileList: [],
  progress: {
    combineVideos: parseInt(0),
    combineVideosBarColor: 'rgb(0, 188, 212)'
  },
  processButton: false,
  stepIndex: 0
}

export default function process (state = initialState, action = {}) {
  switch (action.type) {
    case types.UPDATEPROGRESSBAR:
      return {
        ...state,
        progress: {
          ...state.progress,
          combineVideos: action.payload.progress
        }
      }
    case types.CHANGEPROGRESSBARCOLOR:
      return {
        ...state,
        progress: {
          ...state.progress,
          combineVideosBarColor: action.payload.color
        }
      }
    case types.TOGGLEPROCESSBUTTON:
      return {
        ...state,
        processButton: !state.processButton
      }
    default:
      return state
  }
}
