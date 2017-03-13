import React from 'react'
import IconButton from 'material-ui/IconButton'
import RightArrow from 'material-ui/svg-icons/navigation/arrow-forward'
import LeftArrow from 'material-ui/svg-icons/navigation/arrow-back'
import { browserHistory } from 'react-router'

const bottomButtons = ({ leftArrow, rightArrow }) => {
  return (
    <div className='ButtonRow'>
      <div className='ButtonRowButton'>
        <IconButton
          tooltip={leftArrow.tooltip}
          tooltipPosition='top-center'
          onClick={() => {
            leftArrow.step()
            browserHistory.push(leftArrow.nav)
          }}
          disabled={leftArrow.disabled}
          >
          <LeftArrow />
        </IconButton>
      </div>
      <div className='ButtonRowButton'>
        <IconButton
          tooltip={rightArrow.tooltip}
          tooltipPosition='top-center'
          onClick={() => {
            rightArrow.step()
            browserHistory.push(rightArrow.nav)
          }}
          disabled={rightArrow.disabled}
          >
          <RightArrow />
        </IconButton>
      </div>
    </div>
  )
}

export default bottomButtons
