import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'

import Stepper from '../components/stepper'
import ErrorAlert from '../components/errorAlert'
import BottomButtons from '../components/bottomButtons'
import * as fileActions from '../actions/fileActions'
import * as errorActions from '../actions/errorActions'
import * as uploadPageActions from '../actions/uploadPageActions'
import * as editActions from '../actions/editActions'
import {
  steps
} from '../constants'

var remote = window.require('electron').remote
var dialog = remote.require('electron').dialog

const electronOpenDialogue = () => dialog.showOpenDialog({
  properties: ['openDirectory']
})

class Edit extends Component {
  render () {
    const {
      errorState,
      uploadPageState,
      uploadPageActions,
      errorActions,
      editActions,
      editState
    } = this.props

    function openDialogue () {
      let path = electronOpenDialogue()[0]
      editActions.directorySelect({ path })
    }

    function updateFileName (event, fileName) {
      editActions.updateFileName({ fileName })
    }

    return (
      <div className='EditContainer'>
        <Paper className='StepperContainer'>
          <Stepper
            steps={steps}
            value={uploadPageState.stepper}
          />
        </Paper>

        <div style={{ display: 'flex', justifyContent: 'center' }}>

        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {'Save file to: '}&nbsp;
          <div className='DirectorySelect' onClick={openDialogue}>
            {editState.directory}&nbsp;{'/'}&nbsp;
          </div>

          <TextField
            id='text-field-default'
            defaultValue={editState.fileName}
            onChange={updateFileName}
          />
        </div>

        <BottomButtons
          leftArrow={{
            step: () => uploadPageActions.changeStepper(0),
            nav: '/',
            tooltip: 'Upload',
            disabled: uploadPageState.uploadStep.disabled
          }}
          rightArrow={{
            step: () => uploadPageActions.changeStepper(2),
            nav: '/process',
            tooltip: 'Process',
            disabled: uploadPageState.processStep.disabled
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
    editState: state.edit
  }
}

function mapDispatchToProps (dispatch) {
  return {
    fileActions: bindActionCreators(fileActions, dispatch),
    errorActions: bindActionCreators(errorActions, dispatch),
    uploadPageActions: bindActionCreators(uploadPageActions, dispatch),
    editActions: bindActionCreators(editActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit)
