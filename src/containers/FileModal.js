import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class FileModal extends Component {
  static contextTypes = {
    client: PropTypes.object,
  }
  constructor() {
    super()
    this.uploadFile = this.uploadFile.bind(this)
    this.setAvatar = this.setAvatar.bind(this)
    this.captureImage = this.captureImage.bind(this)
    this.stream = null;
    this.isStreaming = null;
  }
  componentDidMount() {
    navigator.mediaDevices.getUserMedia({ video: true})
      .then((mediaStream) => {
        this.isStreaming = true;
        this.stream = mediaStream;
        this.video = document.getElementsByClassName("image-capture-video")[0];
        this.canvas = document.getElementsByClassName("image-capture-canvas")[0];
        this.video.src = window.URL.createObjectURL(mediaStream);
      })
      .catch(function(err) {
        console.log("An error has ocurred!", error)
      });
  }
  componentWillUnmount() {
    this.stream.getTracks()[0].stop();
  }
  setAvatar(image) {
    let avatar = this.context.client.setAvatar(image)
      .then(() => {
        console.log("Successfully set the avatar to: ", image)
        window.location.reload()
      }, function(error) {
        console.error("Error: ", error)
      });
  }
  uploadFile() {
    let file = document.getElementsByClassName("file-input")[0].files[0];
    this.setProfile(file);
    this.props.onClose();
  }
  setProfile(file) {
    let upload = this.context.client.uploadMedia(file);
    upload.promise.then(this.setAvatar, function(error) {
      console.error("Error: ", error)
    });
  }
  captureImage() {
    if(this.isStreaming) {
      let ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.video, 0, 0, 150, 150);
      let file = this.canvas.toDataURL('image/jpeg');
      this.setProfile(file);
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.props.onClose();
    }
  }

  render() {
    let {onClose} = this.props
    return (
      <div className="modal">
        <div className="modal-content">
          <span onClick={onClose} className="close">CLOSE</span>
          <h2 style={{textAlign: 'center'}}>Set a new avatar picture(WIP)</h2>
          <hr></hr>
          <input type="button" value="Upload File" onClick={this.uploadFile} ></input>
          <input type="file" className="file-input"></input>
          <video width="480" height="270" className="image-capture-video" autoPlay></video>
          <canvas width="150" height="150" className="image-capture-canvas" >wopwop</canvas>
          <input type="button" value="Capture from camera" onClick={this.captureImage} ></input>
        </div>
      </div>
    )
  }
}

export default connect()(FileModal)
