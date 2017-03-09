import React from 'react'
import {
  Step,
  Stepper,
  StepLabel
} from 'material-ui/Stepper'

const stepper = ({ steps, value }) => (
  <Stepper activeStep={value}>
    {steps.map((step, index) => (
      <Step key={'stepper_' + index}>
        <StepLabel>step</StepLabel>
      </Step>
    ))}
  </Stepper>
)

export default stepper
