
import React, {Component} from 'react'
import assign from 'object-assign'

class Dialog extends Component {
  componentDidMount() {
    if (this.props.modal && this.props.onDismiss) {
      window.addEventListener('keydown', this._keyDown)
    }
  }
  componentWillUnmount() {
    if (this.props.modal && this.props.onDismiss) {
      window.removeEventListener('keydown', this._keyDown)
    }
  }
  _dismiss() {
    if (this.props.onDismiss) {
      this.props.onDismiss()
    }
  }
  _keyDown(event) {
    if (event.keyCode === 27 || event.which === 27) {
      this._dismiss()
    }
  }
  _backgroundClick(event) {
    if (event.button !== 0) {
      return
    }
    this._dismiss()
  }
  render() {
    let {position = 'center'} = this.props
    let {size = 'medium'} = this.props
    let classes = ['Dialog', `Dialog-${position}`, `Dialog-${size}`]
    let containerClasses = ['Dialog-container']
    if (this.props.modal) {
      containerClasses.push('Dialog-modal-container')
    }
    if (this.props.containerClasses) {
      containerClasses.push(this.props.containerClasses)
    }
    if (this.props.classes) {
      classes.push(this.props.classes)
    }
    return (
      <div className={containerClasses.join(' ')} onClick={this._backgroundClick}>
        <section className={classes.join(' ')} onClick={event => { event.stopPropagation() }}>
          {this.props.children}
        </section>
      </div>
    )
  }
}

Dialog.propTypes = {
  size: React.PropTypes.string, // wide, medium, narrow
  position: React.PropTypes.string, // top, center, bottom
  modal: React.PropTypes.bool, // dims background

  // makes the dialog dismissable by clicking background or pressing escape
  onDismiss: React.PropTypes.func,
}

export default Dialog
