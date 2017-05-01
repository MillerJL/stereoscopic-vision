import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import path from 'path'

import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import LinearProgress from 'material-ui/LinearProgress'
import Stepper from '../components/stepper'

import ErrorAlert from '../components/errorAlert'
import BottomButtons from '../components/bottomButtons'
import * as fileActions from '../actions/fileActions'
import * as errorActions from '../actions/errorActions'
import * as uploadPageActions from '../actions/uploadPageActions'
import * as editActions from '../actions/editActions'
import * as processActions from '../actions/processActions'
import {
  steps
} from '../constants'

class Edit extends Component {
  render () {
    const {
      errorState,
      uploadPageState,
      uploadPageActions,
      errorActions,
      processActions,
      processState,
      fileState,
      editState
    } = this.props

    return (
      <div className='EditContainer'>
        <Paper className='StepperContainer'>
          <Stepper
            steps={steps}
            value={uploadPageState.stepper}
          />
        </Paper>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              padding: '5px'
            }}
          >
            Stabilizing
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              justifyContent: 'center',
              margin: '0px 0px 20px 0px'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexBasis: '50%',
                  flexDirection: 'column',
                  padding: '0px 5px 0px 0px',
                  marginRight: '5px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {
                      (fileState.leftFileList[0]) ? fileState.leftFileList[0].name : 'Left'
                    }
                  </div>
                  <div>
                    ({processState.progress.stabilizeLeftStep}/2)
                  </div>
                </div>
                <LinearProgress
                  mode='determinate'
                  value={processState.progress.stabilizeRight}
                  color={processState.progress.stabilizeRightColor}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexBasis: '50%',
                  flexDirection: 'column',
                  padding: '0px 0px 0px 5px',
                  marginLeft: '5px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {
                      (fileState.rightFileList[0]) ? fileState.rightFileList[0].name : 'Right'
                    }
                  </div>
                  <div>
                    ({processState.progress.stabilizeRightStep}/2)
                  </div>
                </div>
                <LinearProgress
                  mode='determinate'
                  value={processState.progress.stabilizeLeft}
                  color={processState.progress.stabilizeLeftColor}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              padding: '5px'
            }}
          >
            Combining Videos
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              justifyContent: 'center',
              margin: '0px 0px 20px 0px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {
                  path.join(editState.directory, editState.fileName) || 'No output selected'
                }
              </div>
            </div>
            <LinearProgress
              mode='determinate'
              value={processState.progress.combineVideos}
              color={processState.progress.combineVideosBarColor}
            />
          </div>
          <br />
          <div>
            <RaisedButton
              onClick={() => processActions.process({ tmpDir: editState.tempDirectory })}
              disabled={processState.processButton}
            >
              {'Process'}
            </RaisedButton>
          </div>
        </div>

        <BottomButtons
          leftArrow={{
            step: () => uploadPageActions.changeStepper(1),
            nav: '/edit',
            tooltip: 'Upload',
            disabled: uploadPageState.editStep.disabled
          }}
          rightArrow={{
            step: () => uploadPageActions.changeStepper(2),
            nav: '/process',
            tooltip: 'Process',
            disabled: true
          }}
        />

        <ErrorAlert
          toggleErrorAlert={errorActions.toggleErrorAlert}
          errorState={errorState}
          title='Edit Errors'
        />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    fileState: state.file,
    errorState: state.error,
    uploadPageState: state.uploadPage,
    editState: state.edit,
    processState: state.process
  }
}

function mapDispatchToProps (dispatch) {
  return {
    fileActions: bindActionCreators(fileActions, dispatch),
    errorActions: bindActionCreators(errorActions, dispatch),
    uploadPageActions: bindActionCreators(uploadPageActions, dispatch),
    editActions: bindActionCreators(editActions, dispatch),
    processActions: bindActionCreators(processActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit)
