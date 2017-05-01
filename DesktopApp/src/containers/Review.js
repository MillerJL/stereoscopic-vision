import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hashHistory } from 'react-router'
import path from 'path'

import RaisedButton from 'material-ui/RaisedButton'

import * as fileActions from '../actions/fileActions'
import * as editActions from '../actions/editActions'
import * as processActions from '../actions/processActions'
import * as uploadPageActions from '../actions/uploadPageActions'

class Edit extends Component {
  render () {
    const {
      editState,
      editActions,
      processActions,
      fileActions,
      uploadPageActions
    } = this.props

    function reset (edit, process, file, upload) {
      edit.reset()
      process.reset()
      file.reset()
      upload.reset()

      hashHistory.push('/')
    }

    return (
      <div className='EditContainer'>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', paddingBottom: '10px' }}>
            File Successfully saved to: {path.join(editState.directory, editState.fileName)}
          </div>
          <div style={{ display: 'flex' }}>
            <RaisedButton
              onClick={() => reset(editActions, processActions, fileActions, uploadPageActions)}
              >
              {'Reset'}
            </RaisedButton>
          </div>
        </div>
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
    processActions: bindActionCreators(processActions, dispatch),
    editActions: bindActionCreators(editActions, dispatch),
    uploadPageActions: bindActionCreators(uploadPageActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit)
