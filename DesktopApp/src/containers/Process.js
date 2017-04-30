import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

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
      processState
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
          <div style={{ display: 'flex' }}>
            <RaisedButton
              onClick={processActions.process}
              disabled={processState.processButton}
            >
              {'Process'}
            </RaisedButton>
          </div>
          <br />
          <div>Stabilizing Video 1</div>
          <LinearProgress
            mode='determinate'
            value={processState.progress.stabilizeLeft}
            color={processState.progress.stabilizeLeftColor}
          />
          <br />
          <div>Stabilizing Video 2</div>
          <LinearProgress
            mode='determinate'
            value={processState.progress.stabilizeRight}
            color={processState.progress.stabilizeRightColor}
          />
          <br />
          <div>Combining Videos</div>
          <LinearProgress
            mode='determinate'
            value={processState.progress.combineVideos}
            color={processState.progress.combineVideosBarColor}
          />
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
