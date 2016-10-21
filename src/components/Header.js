
import React, {PropTypes} from 'react'
import '../styles/variables.scss'

const Header = ({className = '', style = {}, ...props}) => (

  <div className={`header ${className}`} {...props} style={{
      backgroundColor: '#58585a',
      width: '100%',
      height: '80',
      ...style,
    }}>
    {props.children}
  </div>
)

export default Header
