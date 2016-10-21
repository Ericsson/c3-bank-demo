
import React, {PropTypes} from 'react'

const SplitContainer = ({
  children,
  direction = 'horizontal',
  className = '',
  ...props,
}) => {
  className = `SplitContainer SplitContainer-${direction} ${className}`
  return (
    <div className={className} {...props}>
      {children[0]}
      <div className='SplitContainer-divider' />
      {children[1]}
    </div>
  )
}

SplitContainer.propTypes = {
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  onClick: PropTypes.func,
}

export default SplitContainer
