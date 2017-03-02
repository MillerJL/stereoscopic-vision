import React from 'react'
import Paper from 'material-ui/Paper'
import Menu from 'material-ui/Menu'
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye'
import UploadFile from 'material-ui/svg-icons/file/file-upload'
import VideoLibrary from 'material-ui/svg-icons/av/video-library'
import Divider from 'material-ui/Divider'
import Edit from 'material-ui/svg-icons/image/edit'
import Download from 'material-ui/svg-icons/file/file-download'
import Delete from 'material-ui/svg-icons/action/delete'
import MenuItem from 'material-ui/MenuItem'
import { Link } from 'react-router'

const sideMenu = () => (
  <div style={{ display: 'flex', flexDirection: 'column', width: '347px', padding: '20px 0px 20px 20px' }}>
    <Paper>
      <Menu>
        <MenuItem primaryText='Stereoscopic Vision' leftIcon={<RemoveRedEye />} />
        <Divider />
        <Link to='/' style={{ textDecoration: 'none' }} activeStyle={{ background: 'red' }}>
          <MenuItem primaryText='Videos' leftIcon={<VideoLibrary />} />
        </Link>
        <Link to='/upload' style={{ textDecoration: 'none' }} activeStyle={{ background: 'red' }}>
          <MenuItem primaryText='Upload' leftIcon={<UploadFile />} />
        </Link>
        <MenuItem primaryText='Edit' leftIcon={<Edit />} />
        <MenuItem primaryText='Export' leftIcon={<Download />} />
        <Divider />
        <MenuItem primaryText='Remove' leftIcon={<Delete />} />
      </Menu>
    </Paper>
  </div>
)

export default sideMenu
