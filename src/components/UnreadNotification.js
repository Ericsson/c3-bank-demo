
import React, {PropTypes} from 'react'

const UnreadNotification = ({unreadCount}) => (
  <div className="UnreadNotification-container">
    <span className='UnreadNotification'>
      {unreadCount}
    </span>
  </div>
)

UnreadNotification.propTypes = {

}

export default UnreadNotification
