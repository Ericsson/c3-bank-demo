import React, {PropTypes} from 'react'
import {Icon, IconStack} from 'components'
import FlipMove from 'react-flip-move'
import {appIcons} from 'modules/config'

const ViewIcon = ({
  selectedView,
  onSelectView,
  id,
  name,
  color,
}) => {
  let active = {
    border: '3px solid transparent',
    padding: '3',
  }
  if (selectedView === id) {
    active = {
      border: ' 3px solid #00285F',
      borderRadius: '100%',
      padding: '3',
    }
  }
  if (onSelectView) {
    active.cursor = 'pointer'
  }
  let circle = {
    backgroundColor: 'white',
    color: 'white',
    borderRadius: '100%',
  }
  return (
    <div style={active} className='ViewIcon' >
      <span className='ViewIcon-item fa-stack fa-2x' onClick={() => onSelectView && onSelectView(id)}>
        <Icon name='circle' style={circle} stack='2x' />
        <Icon name={name} stack='1x' style={{color}} />
      </span>
    </div>
  )
}

ViewIcon.propTypes = {
  selectedView: PropTypes.string,
  onSelectView: PropTypes.func,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
}

export default ViewIcon
