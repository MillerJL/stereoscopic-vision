import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import Paper from 'material-ui/Paper'
import * as fileActions from '../actions/fileActions'
import * as errorActions from '../actions/errorActions'
import * as uploadPageActions from '../actions/uploadPageActions'
import FileCard from '../components/fileCard'
import Stepper from '../components/stepper'
import ErrorAlert from '../components/errorAlert'
import BottomButtons from '../components/bottomButtons'
import {
  steps
} from '../constants'

class Upload extends Component {
  onDropLeft (acceptedFiles, rejectedFiles) {
    let validateAddFile = this.props.fileActions.validateAddFile

    validateAddFile({
      files: acceptedFiles,
      side: 'left'
    })
  }

  onDropRight (acceptedFiles, rejectedFiles) {
    let validateAddFile = this.props.fileActions.validateAddFile

    validateAddFile({
      files: acceptedFiles,
      side: 'right'
    })
  }

  removeFile (side, fileNum) {
    if (side === 'left') this.props.fileActions.removeLeftFile(fileNum)
    else this.props.fileActions.removeRightFile(fileNum)
  }

  render () {
    const {
      fileState,
      errorState,
      uploadPageState,
      uploadPageActions,
      errorActions
    } = this.props

    return (
      <div className='UploadContainer'>
        <Paper className='StepperContainer'>
          <Stepper
            steps={steps}
            value={uploadPageState.stepper}
          />
        </Paper>

        <div className='DropZoneContainer'>
          <Paper className='DropZonePaper Left'>
            <Dropzone
              onDrop={this.onDropLeft.bind(this)}
              className='DropZoneUpload'
              activeClassName='DropZoneUploadActive'
            >
              <div className='DropZoneText'>Left</div>
            </Dropzone>
          </Paper>
          <Paper className='DropZonePaper Right'>
            <Dropzone
              onDrop={this.onDropRight.bind(this)}
              className='DropZoneUpload'
              activeClassName='DropZoneUploadActive'
            >
              <div className='DropZoneText'>Right</div>
            </Dropzone>
          </Paper>
        </div>

        <div style={{ display: 'flex' }}>
          <div className='FileList Left'>
            {fileState.leftFileList.map((file, index) => (
              <FileCard
                file={file}
                index={index}
                side='left'
                key={'leftFileList_' + index}
                onDelete={this.removeFile.bind(this)}
              />
            ))}
          </div>
          <div className='FileList Right'>
            {fileState.rightFileList.map((file, index) => (
              <FileCard
                file={file}
                index={index}
                side='right'
                key={'rightFileList_' + index}
                onDelete={this.removeFile.bind(this)}
              />
            ))}
          </div>
        </div>

        <BottomButtons
          leftArrow={{
            step: () => uploadPageActions.changeStepper(0),
            nav: '/',
            tooltip: 'Home',
            disabled: false
          }}
          rightArrow={{
            step: () => uploadPageActions.changeStepper(1),
            nav: '/Edit',
            tooltip: 'Edit',
            disabled: false
          }}
        />

        <ErrorAlert
          toggleErrorAlert={errorActions.toggleErrorAlert}
          errorState={errorState}
          title='Upload Errors'
        />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    fileState: state.file,
    errorState: state.error,
    uploadPageState: state.uploadPage
  }
}

function mapDispatchToProps (dispatch) {
  return {
    fileActions: bindActionCreators(fileActions, dispatch),
    errorActions: bindActionCreators(errorActions, dispatch),
    uploadPageActions: bindActionCreators(uploadPageActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload)
