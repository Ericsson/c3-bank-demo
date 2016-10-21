
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {leaveMeeting, hideModal} from 'actions'
import {Dialog} from 'components'

class MeetingViewLeave extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  onLeave() {
    let {role, onLeave} = this.props
    onLeave()
    this.context.router.replace('/advisor/authed/')
    if(role === 'advisor') {
      this.context.router.replace('/advisor/authed/')
    } else {
      this.context.router.replace('/feedback')
    }
  }
  onCancel() {
    let {onCancel} = this.props
    onCancel()
  }
  render() {
    return (
      <div className='MeetingViewLeave'>
        <Dialog>
            <h1>Leave meeting</h1>
            <p style={{textAlign: 'center'}}>Are you sure you want to leave the meeting?</p>
            <div className="MeetingViewLeave-buttons">
              <div onClick={() => this.onLeave()} className='default-button'>
                Leave meeting
              </div>
              <div onClick={() => this.onCancel()} className="default-button">
                Cancel
              </div>
            </div>
        </Dialog>
      </div>
    )
  }
}

function getSidebar({role}) {
  if (role === 'advisor') {
    return <AdvisorSidebar/>
  } else if (role === 'customer') {
    return <CustomerSidebar/>
  }
}

function mapStateToProps({meeting}) {
  return {
    role: meeting.context.role,
  }
}

 function mapDispatchToProps(dispatch) {
   return {
     onLeave: () => dispatch(leaveMeeting()),
     onCancel: () => dispatch(hideModal()),
   }
 }

export default connect(mapStateToProps, mapDispatchToProps)(MeetingViewLeave)
