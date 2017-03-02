import React from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import MenuItem from 'material-ui/MenuItem'

const Logged = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><NavigationMenu color='white' /></IconButton>
    }
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    <MenuItem primaryText='Refresh' />
    <MenuItem primaryText='Help' />
  </IconMenu>
)

const appBar = () => (
  <AppBar
    title='My Videos'
    iconClassNameRight='muidocs-icon-navigation-expand-more'
    zDepth={2}
    style={{ paddingBottom: '15px' }}
    iconElementLeft={<Logged />}
  />
)

export default appBar
