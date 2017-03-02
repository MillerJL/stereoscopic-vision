import React from 'react'
import Avatar from 'material-ui/Avatar'
import FileFolder from 'material-ui/svg-icons/file/folder'
import Videocam from 'material-ui/svg-icons/av/videocam'
import GpsFixed from 'material-ui/svg-icons/device/gps-fixed'
import Delete from 'material-ui/svg-icons/action/delete'
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'

const appBar = ({ file, index }) => {
  let icon

  switch (file.type) {
    case 'unknown':
      icon = <Avatar icon={<FileFolder />} />
      break
    case 'video':
      icon = <Avatar icon={<Videocam />} />
      break
    case 'fit':
      icon = <Avatar icon={<GpsFixed />} />
      break
  }

  return (
    <div style={{ display: 'flex', marginBottom: '5px' }}>
      <Card style={{ width: '90%' }} containerStyle={{ display: 'flex', flexBasis: '90%' }}>
        <CardHeader
          title={file.name}
          avatar={icon}
          subtitle={file.size.toFixed(1) + 'mb - ' + file.path.substring(0, file.path.lastIndexOf('/'))}
        />
      </Card>
      <div className='CardDeleteButton'>
        <IconButton>
          <Delete />
        </IconButton>
      </div>
    </div>
  )
}

export default appBar
