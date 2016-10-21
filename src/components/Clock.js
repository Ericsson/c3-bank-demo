
import React, {Component} from 'react'

export default class Clock extends Component {
  getTime() {
    let date = new Date
    return {
      hours: date.getHours(),
      minutes: date.getMinutes(),
    }
  }
  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 5000)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  render() {
    let {hours, minutes} = this.getTime()
    return <span className='Clock'>{pad(hours)}:{pad(minutes)}</span>
  }
}

function pad(num) {
  return ('00' + num).slice(-2)
}
