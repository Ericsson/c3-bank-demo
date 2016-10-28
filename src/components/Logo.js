
import React, {PropTypes} from 'react'
import logo from '../images/econ_blue.png'
import logoWhite from '../images/econ_white.png'

const Logo = ({className = '', style = {}, ...props}) => (
  <div className={`Logo ${className}`} {...props} style={{
      backgroundImage: `url(${className == 'white' ? logoWhite : logo})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      width: 48,
      height: 64,
      marginTop: 30,
      marginBottom: 15,
      ...style,
    }}
  />
)

export default Logo
