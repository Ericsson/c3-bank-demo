
import React, {PropTypes} from 'react'

const ProgressBar = ({progress, className, ...props}) => (
  <div className={`ProgressBar ${className || ''}`} {...props}>
    <div className='ProgressBar--bar' style={{width: `${progress * 100}%`}}/>
  </div>
)

ProgressBar.propTypes = {
  progress: PropTypes.number,
}

export default ProgressBar
