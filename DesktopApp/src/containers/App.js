import '../public/stylesheets/main.css'
import React, { Component } from 'react'
import SideMenu from '../components/sideMenu'
import AppBarComponent from '../components/appbar'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'

class CounterApp extends Component {
  render () {
    const {
      content
    } = this.props

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div className='App'>
          <div className='Content'>
            <AppBarComponent />
            <Paper className='ContentMain' zDepth={2}>
              {content}
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default CounterApp
