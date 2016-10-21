
import React, {Component, PropTypes} from 'react';
import {Video} from 'components';

export default class VideoCombo extends Component {
  static propTypes = {
    // Chat component
    children: PropTypes.element
  }
  render() {
    let {
      localSource,
      remoteSource,
      remoteAudioMuted = false,
      localVideoDisabled = false,
      children,
    } = this.props
    return (
      <div className='VideoCombo'>
        <div className='VideoCombo-remote-view'>
          <Video source={remoteSource} muted={remoteAudioMuted}/>
        </div>
        <div className='VideoCombo-self-view'>
          {localVideoDisabled
            ? null
            : <Video source={localSource} muted={true}/>
          }
        </div>
      </div>
    )
  }
}
