
import React, {Component, PropTypes} from 'react'
import {Router, Route, IndexRoute, Redirect, IndexRedirect} from 'react-router'
import * as advisorAuth from 'modules/advisorAuth'
import {
  AdvisorBootstrap,
  AdvisorHomeScreen,
  AdvisorLoginScreen,
  AdvisorMeetingBootstrap,
  AdvisorSidebar,
  AdvisorRegisterScreen,
  App,
  CustomerSidebar,
  CustomerBootstrap,
  CustomerLandingPage,
  MeetingHome,
  MeetingNotFound,
  MeetingScreen,
  NotFoundScreen,
  FeedbackScreen,
  PostFeedbackScreen,
} from 'containers'

const createMeetingRoutes = ({accessComponent}) => (
  <Route path='meeting' component={accessComponent}>
    <IndexRedirect to='not-found' />
    <Route path='not-found' component={MeetingNotFound} />
    <Route path=':meetingId' component={MeetingScreen} />
  </Route>
)

const Routes = ({history}) => (
  <Router history={history}>
    <Route path='/' component={App}>
      <IndexRedirect to='advisor' />
      <Route path='advisor' component={AdvisorBootstrap}>
        <Route path='login'>
          <IndexRoute component={AdvisorLoginScreen} />
        </Route>
        <Route path='authed'>
          <IndexRoute component={AdvisorHomeScreen} />
          <Route path='meeting' component={AdvisorMeetingBootstrap}>
            <IndexRedirect to='not-found' />
            <Route path='not-found' component={MeetingNotFound} />
            <Route path=':meetingId' component={MeetingScreen} />
          </Route>
        </Route>
        <Route path='not-found' component={NotFoundScreen} />
        <Redirect from='*' to='not-found' />
      </Route>
      <Route path='register' component={AdvisorRegisterScreen} />
      <Route path='meeting' component={CustomerBootstrap}>
        <IndexRedirect to='not-found' />
        <Route path='not-found' component={MeetingNotFound} />
        <Route path=':meetingId' component={MeetingScreen} />
      </Route>
      <Route path='feedback' component={FeedbackScreen} />
      <Route path='done' component={PostFeedbackScreen} />
      <Redirect from='*' to='/' />
    </Route>
  </Router>
)

Routes.propTypes = {
  history: PropTypes.object.isRequired,
}

export default Routes
