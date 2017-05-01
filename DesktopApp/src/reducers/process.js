import * as types from '../actions'

const initialState = {
  leftFileList: [],
  rightFileList: [],
  progress: {
    combineVideos: 0,
    combineVideosBarColor: 'rgb(0, 188, 212)',
    stabilizeLeft: 0,
    stabilizeLeftColor: 'rgb(0, 188, 212)',
    stabilizeLeftStep: 1,
    stabilizeRight: 0,
    stabilizeRightColor: 'rgb(0, 188, 212)',
    stabilizeRightStep: 1
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
          combineVideos: action.payload.progress,
          combineVideosBarColor: action.payload.color
        }
      }
    case types.UPDATELEFTPROGRESSBAR:
      return {
        ...state,
        progress: {
          ...state.progress,
          stabilizeLeft: action.payload.progress,
          stabilizeLeftColor: action.payload.color,
          stabilizeLeftStep: action.payload.step
        }
      }
    case types.UPDATERIGHTPROGRESSBAR:
      return {
        ...state,
        progress: {
          ...state.progress,
          stabilizeRight: action.payload.progress,
          stabilizeRightColor: action.payload.color,
          stabilizeRightStep: action.payload.step
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
