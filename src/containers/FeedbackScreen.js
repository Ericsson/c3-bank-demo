import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link, Navigation} from 'react-router';
import Logo from 'components/Logo'
import Dialog from 'components/Dialog';
import VoidAnchor from 'components/VoidAnchor';

class YesNoQuestion extends Component {
  constructor() {
    super()
  }
  render() {
    let isYes = this.props.selected === true;
    let isNo = this.props.selected === false;
    return (
      <div className="customer-feedback-box">
        <h4>{this.props.label}</h4>
        <div className="yes-no-buttons">
          <label className="default-radio">
            <input type="radio" checked={isYes} onClick={() => this.props.onSelect(true)}/>
            <i/>
            <span>Yes</span>
          </label>
          <label className="default-radio">
              <input type="radio" checked={isNo} onClick={() => this.props.onSelect(false)}/>
              <i/>
              <span>No</span>
          </label>
        </div>
      </div>
    );
  }
}

class RatingBox extends Component {
  constructor() {
    super()
  }
  render() {
      let stars = Array(5).fill(0).map((ignore, i) => (
        <VoidAnchor
          className={`fa fa-star${i >= this.props.rating ? '-o' : ''}`}
          onClick={() => this.props.onRate(i + 1)}/>
      ));
      return (
        <div className="customer-feedback-box">
            <h4>{this.props.label}</h4>
            <div>{stars}</div>
        </div>
      );
  }
}

class FeedbackScreen extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super()
    this.state = {
      qualityRating: 0,
      valueRating: 0,
      wouldRecommend: null,
    }
    this._submit = this._submit.bind(this)
  }
  _submit() {
    let {qualityRating, valueRating, wouldRecommend} = this.state
    if(typeof qualityRating !== 'number'
     || typeof valueRating !== 'number'
     || typeof wouldRecommend === 'undefined') {
        return;
    }
    room.send('feedback', {
      qualityRating: qualityRating,
      valueRating: valueRating,
      wouldRecommend: wouldRecommend,
    })
    this.context.router.replace('/done')
  }
  render() {
      return (
          <main className="customer-feedback customer-feedback-form">
              <div className="logo-container">
                <Logo className="FeedbackScreen-Logo"/>
              </div>
              <Dialog>
                  <h1>Thank you for the meeting</h1>
                  <h3>Please let us know how it went</h3>
                  <div className="divider"/>
                  <RatingBox
                      label="The quality of the meeting"
                      rating={this.state.qualityRating}
                      onRate={qualityRating => this.setState({qualityRating})}/>
                  <div className="divider"/>
                  <RatingBox
                      label="The value of the meeting"
                      rating={this.state.valueRating}
                      onRate={valueRating => this.setState({valueRating})}/>
                  <div className="divider"/>
                  <YesNoQuestion
                      label="Would you recommend this service?"
                      selected={this.state.wouldRecommend}
                      onSelect={wouldRecommend => this.setState({wouldRecommend})}/>
                  <div className="divider"/>
                  <VoidAnchor className="default-button" onClick={this._submit}>
                      Submit
                  </VoidAnchor>
              </Dialog>
          </main>
      );
  }
}

export default connect()(FeedbackScreen)
