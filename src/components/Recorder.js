
import React, {PropTypes} from 'react'

const Recorder = ({clickHandler, isRecording}) => (
  <div className="tooltip-wrapper">
    <div className="tooltip">{isRecording ? 'Stop recording' : 'Start recording'}</div>
    <div className={`Recorder ${isRecording ? 'Recorder-pulse' : ''}`} onClick={clickHandler}>
      <div />
    </div>
  </div>
)

export default Recorder
