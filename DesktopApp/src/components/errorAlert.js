import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Subheader from 'material-ui/Subheader'

const errorAlert = ({ toggleErrorAlert, errorState, title }) => {
  const errorAlertButtons = [
    <FlatButton
      label='ya okay'
      primary
      onTouchTap={toggleErrorAlert}
    />
  ]

  return (
    <Dialog
      modal={false}
      open={errorState.errorAlert}
      onRequestClose={toggleErrorAlert}
      actions={errorAlertButtons}
      title={title}
    >
      {errorState.errorMessages.map((error, index) => {
        return (
          <div key={'error_' + index}>
            {error.message}
            <Subheader>{error.file}</Subheader>
          </div>
        )
      })}
    </Dialog>
  )
}

export default errorAlert
