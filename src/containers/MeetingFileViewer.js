
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PdfEditor} from 'components'
import {addSignedDocument} from 'actions'

class MeetingFileViewer extends Component {
  constructor(props) {
    super(props)
    this.onLoad = this.onLoad.bind(this)
    this.state = {file: this.getFile(this.props)}
  }
  componentWillMount() {
    if (this.props.fileRef) {
      this.props.fileRef.on('load', this.onLoad)
    }
  }
  componentWillReceiveProps(newProps) {
    if (this.props.fileRef) {
      this.props.fileRef.off('load', this.onLoad)
    }
    if (newProps.fileRef) {
      newProps.fileRef.on('load', this.onLoad)
    }
    this.setState({file: this.getFile(newProps)})
  }
  componentWillUnmount() {
    if (this.props.fileRef) {
      this.props.fileRef.off('load', this.onLoad)
    }
  }
  onLoad() {
    this.setState({file: this.getFile(this.props)})
  }
  getFile(props) {
    if (props.fileRef) {
      return props.fileRef.file
    } else {
      return null
    }
  }
  render() {
    let {file} = this.state
    let {data, onSignedDocument} = this.props

    if (file && file.type.match(/pdf/)) {
      let props = {file, data, onSignedDocument}
      return <PdfEditor className='MeetingFileViewer' {...props}/>
    }

    if (file && file.type.match(/^image\//)) {
      let url = URL.createObjectURL(file)
      return <img className='MeetingFileViewer MeetingFileViewer--image' src={url}/>
    }

    return <div className='MeetingFileViewer'/>
  }
}

function mapStateToProps(state) {
  return {
    fileRef: state.meeting.stateSync.editorFile,
    data: state.meeting.editSync.currentData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSignedDocument: (fileRef) => dispatch(addSignedDocument(fileRef)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingFileViewer)
