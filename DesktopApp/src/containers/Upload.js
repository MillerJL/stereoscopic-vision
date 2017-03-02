import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import Paper from 'material-ui/Paper'
import * as fileActions from '../actions/fileActions'
import FileCard from '../components/fileCard'
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

class Upload extends Component {
  constructor (props) {
    super()

    this.fileState = props.fileState
    this.fileActions = props.fileActions
  }

  onDropLeft (acceptedFiles, rejectedFiles) {
    let addLeftFile = this.fileActions.addLeftFile

    acceptedFiles.forEach(file => {
      addLeftFile(file)
    })
  }

  onDropRight (acceptedFiles, rejectedFiles) {
    let addRightFile = this.fileActions.addRightFile

    acceptedFiles.forEach(file => {
      addRightFile(file)
    })
  }

  removeFile () {
    this.fileActions.removeFile(this.fileNum)
  }

  render () {
    const {
      fileState
    } = this.props

    return (
      <div className='UploadContainer'>
        <Paper style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <Stepper activeStep={0}>
            <Step>
              <StepLabel>Select</StepLabel>
            </Step>
            <Step>
              <StepLabel>Edit</StepLabel>
            </Step>
            <Step>
              <StepLabel>Process</StepLabel>
            </Step>
          </Stepper>
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
              <FileCard file={file} index={index} key={'leftFileList-' + index} />
            ))}
          </div>
          <div className='FileList Right'>
            {fileState.rightFileList.map((file, index) => (
              <FileCard file={file} index={index} key={'rightFileList-' + index} />
            ))}
          </div>
        </div>
        <div className='ButtonRow'>
          <div className='ButtonRowButton'>
            <RaisedButton>{'Back'}</RaisedButton>
          </div>
          <div className='ButtonRowButton'>
            <RaisedButton>{'Next'}</RaisedButton>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    fileState: state.file
  }
}

function mapDispatchToProps (dispatch) {
  return {
    fileActions: bindActionCreators(fileActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload)
