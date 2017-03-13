import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Paper from 'material-ui/Paper'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

import Stepper from '../components/stepper'
import ErrorAlert from '../components/errorAlert'
import BottomButtons from '../components/bottomButtons'
import * as fileActions from '../actions/fileActions'
import * as errorActions from '../actions/errorActions'
import * as uploadPageActions from '../actions/uploadPageActions'
import * as directorySelectActions from '../actions/directorySelectActions'
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
      directorySelectActions,
      directorySelectState
    } = this.props

    const DirectorySelectActions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={directorySelectActions.toggleDialog}
      />,
      <FlatButton
        label='Submit'
        primary
        keyboardFocused
        onTouchTap={directorySelectActions.toggleDialog}
      />
    ]

    return (
      <div className='EditContainer'>
        <Paper className='StepperContainer'>
          <Stepper
            steps={steps}
            value={uploadPageState.stepper}
          />
        </Paper>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {'ayy'}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {'Save file to: '}&nbsp;
          <div className='DirectorySelect' onClick={directorySelectActions.toggleDialog}>
            {'Default'}&nbsp;{'/'}&nbsp;
          </div>
          <TextField
            id='text-field-default'
            defaultValue='Default Value'
          />
        </div>

        <BottomButtons
          leftArrow={{
            step: () => uploadPageActions.changeStepper(0),
            nav: '/upload',
            tooltip: 'Upload',
            disabled: false
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

        <Dialog
          title='Select save directory'
          actions={DirectorySelectActions}
          modal={false}
          open={directorySelectState.dialogOpen}
          onRequestClose={directorySelectActions.toggleDialog}
        >
          The actions in this window were passed in as an array of React objects.
        </Dialog>

      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    fileState: state.file,
    errorState: state.error,
    uploadPageState: state.uploadPage,
    directorySelectState: state.directorySelect
  }
}

function mapDispatchToProps (dispatch) {
  return {
    fileActions: bindActionCreators(fileActions, dispatch),
    errorActions: bindActionCreators(errorActions, dispatch),
    uploadPageActions: bindActionCreators(uploadPageActions, dispatch),
    directorySelectActions: bindActionCreators(directorySelectActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit)
