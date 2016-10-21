
import React, {PropTypes} from 'react'
import Icon from 'react-fa'

export const IconStack = ({top, bottom, ...props}) => (
  <span className='fa-stack fa-2x IconStack' {...props}>
    <Icon stack='2x' className='IconStack-top' {...top} />
    <Icon stack='1x' className='IconStack-bottom' {...bottom} />
  </span>
)

IconStack.propTypes = {
  top: PropTypes.object,
  bottom: PropTypes.object,
}

// export const FaIcon = ({icon, className = '', ...rest}) => {
//   let iconsClass = `fa-${icon}`
//   return <i className={`fa ${iconsClass} ${className}`} {...rest}/>
// }

// FaIcon.propTypes = {
//   icon: PropTypes.string.isRequired,
//   className: PropTypes.string,
// }

// export const FaStack = ({icon, className = '', ...rest}) => {
//   return (
//     <span className={`fa-stack fa-2x ${className}`} {...rest}>
//       <FaIcon icon='circle' className='fa-stack-2x'/>
//       <FaIcon icon={icon} className='fa-stack-1x fa-inverse'/>
//     </span>
//   )
// }

// FaStack.propTypes = {
//   icon: PropTypes.string.isRequired,
//   className: PropTypes.string,
// }

// export const AdvisoryIcon = ({
//   icon,
//   className = '',
//   off = false,
//   invert = false,
//   primary,
//   secondary,
//   ...rest,
// }) => {
//   let iconsClass = `AdvisoryIcon-${icon}`
//   if (off) {
//     iconsClass += '-off'
//   }
//   let styleA = {color: primary}
//   let styleB = {color: secondary}
//   if (invert) {
//     [styleA, styleB] = [styleB, styleA]
//   }
//   return (
//     <span className={`fa-stack fa-2x ${className}`} {...rest}>
//         <FaIcon icon='circle' className='fa-stack-2x' style={styleB}/>
//         <i className={`AdvisoryIcon ${iconsClass} fa-stack-1x fa-inverse`} style={styleA}/>
//     </span>
//   )
// }

// const availableAdvisoryIcons = [
//   'audio',
//   'chat',
//   'computer',
//   'displays',
//   'endcall',
//   'lock',
//   'star',
//   'star_empty',
//   'startcall',
//   'video',
// ]

// AdvisoryIcon.propTypes = {
//   icon: PropTypes.oneOf(availableAdvisoryIcons),
//   primary: PropTypes.string.isRequired,
//   secondary: PropTypes.string.isRequired,
//   className: PropTypes.string,
//   invert: PropTypes.bool,
//   off: PropTypes.bool,
// }
