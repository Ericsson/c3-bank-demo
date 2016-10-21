
import React, {Component, PropTypes} from 'react'

class Video extends Component {
  constructor(props) {
    super(props)
    this.video = null
    this.sink = new cct.HtmlSink()
    this.handleRef = this.handleRef.bind(this)
    this.handleVideoUpdate = this.handleVideoUpdate.bind(this)
    if (props.source) {
      props.source.connect(this.sink)
    }
  }

  handleVideoUpdate() {
    let width = 0
    let height = 0
    let aspectRatio = 0

    if (this.video) {
      width = this.video.videoWidth
      height = this.video.videoHeight

      if (width) {
        aspectRatio = width / height
      }
    }

    this.props.onResize({width, height, aspectRatio})
  }

  shouldComponentUpdate(newProps) {
    return newProps.source !== this.props.source
  }

  componentWillReceiveProps(newProps) {
    if (newProps.source !== this.props.source) {
      if (newProps.source) {
        newProps.source.connect(this.sink)
      } else if (this.source) {
        this.props.source.disconnect(this.sink)
      }
    }
  }

  handleRef(ref) {
    if (this.props.onResize && this.video) {
      this.video.removeEventListener('loadedmetadata', this.handleVideoUpdate)
      this.video.removeEventListener('emptied', this.handleVideoUpdate)
    }
    this.sink.target = ref
    this.video = ref
    if (this.props.onResize) {
      if (ref) {
        ref.addEventListener('loadedmetadata', this.handleVideoUpdate)
        ref.addEventListener('emptied', this.handleVideoUpdate)
      }
      this.handleVideoUpdate()
    }
  }

  render() {
    return (
      <video className='Video' ref={this.handleRef} muted={this.props.muted} autoPlay />
    )
  }
}

Video.propTypes = {
  source: PropTypes.object,
  onResize: PropTypes.func,
  muted: PropTypes.bool,
}

export default Video
