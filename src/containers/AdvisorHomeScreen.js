
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {logout} from 'modules/advisorAuth'
import {chromeExtensionId} from 'modules/config'
import {bookNewMeeting, createMeetingsQuery, createMeetingLink} from 'modules/advisorUtils'
import {SplitContainer, Avatar, Clock, Logo, IfNeedScreenSharingExtension, Header} from 'components'
import {SidebarAvatarSlot, FileModal} from 'containers'
import defaultAvatar from '../images/default_user.png'

const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)

class  MeetingHeader extends Component {
  constructor() {
    super()
    this.handleEnter = this.handleEnter.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }
  handleEnter() {
    let {meeting} = this.props
    this.context.router.push(`/advisor/authed/meeting/${encodeURIComponent(meeting.id)}`)
  }
  handleRemove() {
    let {meeting} = this.props
    meeting.leave()
  }
  render() {
    let {meeting} = this.props
    return (
      <div className="MeetingHeader">
        <Link className="default-button" to={`/advisor/authed/meeting/${encodeURIComponent(meeting.id)}`}> Enter meeting </Link>
        <span  style={{margin: '10px', fontWeight: 'bold'}} onClick={this.handleRemove}> x </span>
      </div>
    )
  }
}

MeetingHeader.propTypes = {
  meeting: PropTypes.object,
}

class MeetingListItem extends Component {
  constructor() {
    super()
  }
  render() {
    let {meeting} = this.props
    return (
      <li className="MeetingListItem">
      <span className="MeetingListItem-marker">{meeting.name || meeting.id} </span>
      <div className="MeetingListItem-content">
        <div className="MeetingListItem-dropdown-content">
          <div>
            <span>Send link to customer </span>
            <a href={createMeetingLink(meeting)} target="_blank"> Open in new window</a>
          </div>
          <div>
            <input type="text" defaultValue={createMeetingLink(meeting)} readOnly size={60}/> &nbsp;
          </div>
        </div>
        <MeetingHeader meeting={meeting}/>
      </div>
      </li>
    )
  }
}

const MeetingList = ({meetings}) => (
  <ul className="MeetingList scroll-box-y">
    {meetings.map((meeting) => <MeetingListItem meeting={meeting} key={meeting.id}/>)}
  </ul>
)

class MeetingBookingForm extends Component {
  static contextTypes = {
    client: PropTypes.object,
  }
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      working: false,
      error: null,
    }
  }
  handleSubmit(event) {
    event.preventDefault()
    let name = this.name.value
    this.name.value = ''
    this.setState({working: true})
    bookNewMeeting(this.context.client, {name})
      .then(
        () => this.setState({working: false}),
        () => this.setState({working: false}),
      )
  }
  render() {
    return (
      <form className="AdvisorHomeScreen-booking" onSubmit={this.handleSubmit}>
        <h2>Book a new meeting</h2>
        <div className="BookingForm">
          <label style={{margin: '10px'}}>Meeting name</label>
          <input style={{height: '25px'}} type="text" ref={ref => {this.name = ref}} required/>
          {this.props.working && '...'}
          {this.props.error}
          <input className="default-button" type="submit" value="Create meeting"></input>
        </div>
      </form>
    )
  }
}

class Sidebar extends Component {
  constructor () {
    super()
    this.handleLogout = this.handleLogout.bind(this)
    this.handleAvatarUpdate = this.handleAvatarUpdate.bind(this)
    this.onClose = this.onClose.bind(this)
    this.state = {
      showModal: false
    }
  }
  handleLogout() {
    let {client, router} = this.props
    logout(client)
    router.push('/advisor/login')
  }
  handleAvatarUpdate() {
    this.setState({showModal: true});
  }
  onClose() {
    if (this.state.showModal) {
      this.setState({showModal: false});
    }
  }
  render() {
    let {client} = this.props
    let modal = null,
      avatarText = null
    if (this.state.showModal) {
      modal = <FileModal onClose={this.onClose} />
    }
    if(!client.user.avatar) {
      avatarText =
        <div className="Sidebar-container">
          <span className="Sidebar-avatar-text">Click to change avatar</span>
        </div>
    }
    return (
      <div className="Sidebar">
        <Avatar user={client.user}
          style={{cursor: 'pointer', margin: '10px 0'}}
          size={120}
          clickHandler={this.handleAvatarUpdate}
          defaultAvatarUrl={defaultAvatar}
          >
          {avatarText}
        </Avatar>
        {modal}
        <button className="default-button invert" onClick={this.handleLogout}>Logout</button>
        <div className='Sidebar--spacing'/>
        <Clock/>
        <Logo className='white'/>
      </div>
    )
  }
}

class AdvisorHomeScreen extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
    client: React.PropTypes.object,
  }
  constructor() {
    super()
    this.handleMeetingsUpdate = this.handleMeetingsUpdate.bind(this)
    this.state = {
      meetings: [],
    }
  }
  componentDidMount() {
    this.meetingsQuery = createMeetingsQuery(this.context.client)
    this.meetingsQuery.on('update', this.handleMeetingsUpdate)
  }
  componentWillUnmount() {
    this.meetingsQuery.off('update', this.handleMeetingsUpdate)
    this.meetingsQuery.off = () => {} // Fix for 0.13.1
    // this.meetingsQuery.stop()
  }
  handleMeetingsUpdate(rows) {
    this.setState({meetings: rows.slice()})
  }
  render() {
    let extensionUrl = `https://chrome.google.com/webstore/detail/${chromeExtensionId}`
    let message = null
    if (isChrome) {
      message =  (
        <IfNeedScreenSharingExtension extensionId={chromeExtensionId}>
          <h3 style={{color: '#f00'}}>
            Screen sharing extension is not installed. Get it from the <a target='_blank' href={extensionUrl}>Chrome web store</a>.
          </h3>
        </IfNeedScreenSharingExtension>
      )
    }
    return (
        <div className="AdvisorHomeScreen">
          <SplitContainer style={{height: 'calc(100vh - 20px)'}} direction='horizontal'>
            <div className="AdvisorHomeScreen-meetingscreen">
              <Header>
                <h1 className="AdvisorHomeScreen-HeaderTitle">Ericsson Web Meetings</h1>
                <div className="AdvisorHomeScreen-HeaderSubtitle">Powered by Ericsson Contextual Communication Cloud</div>
              </Header>
              <div className="AdvisorHomeScreen-container">
                <MeetingBookingForm />
                <div className="AdvisorHomeScreen-meetings">
                  <h2>Today&#39;s Scheduled Meetings</h2>
                  {message}
                  <MeetingList meetings={this.state.meetings}/>
                </div>
            </div>
            </div>
            <Sidebar client={this.context.client} router={this.context.router} />
          </SplitContainer>
        </div>
      )
  }
}

export default connect()(AdvisorHomeScreen)
