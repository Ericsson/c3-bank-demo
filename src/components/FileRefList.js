
import React, {Component, PropTypes} from 'react'
import donwloadFile from 'modules/downloadFile'
import {Icon} from 'components'

const icons = {
  'application/pdf': require('images/pdf_icon.png'),
}
const defaultIcon = ''

class FileTransferProgress extends Component {
  constructor(props) {
    super(props)
    this.onProgress = this.onProgress.bind(this)
    this.onTransfer = this.onTransfer.bind(this)
    let [transfer = null] = props.fileRef.transfers
    this.onTransfer(transfer)
    this.state = {
      progress: transfer ? transfer.progress : 0,
    }
  }
  componentWillMount() {
    this.props.fileRef.on('transfer', this.onTransfer)
  }
  componentWillDismount() {
    if (this.transfer) {
      this.transfer.off('progress', this.onProgress)
      this.transfer = null
    }
    this.props.fileRef.off('transfer', this.onTransfer)
  }
  onTransfer(transfer) {
    if (this.transfer) {
      this.transfer.off('progress', this.onProgress)
    }
    this.transfer = transfer
    if (this.transfer) {
      this.transfer.on('progress', this.onProgress)
    }
  }
  onProgress(progress) {
    this.setState({progress})
  }
  render() {
    let content = null
    if (this.transfer && this.state.progress < 1) {
      let width = ((this.state.progress * 100) | 0) + '%'
      return (
        <div className='FileTransferProgress FileProgress'>
          <div className='FileTransferProgress-bar FileProgress-bar' style={{width}} />
        </div>
      )
    }
    return null
  }
}

class FileFetchProgress extends Component {
  constructor(props) {
    super(props)
    this.onProgress = this.onProgress.bind(this)
    this.state = {
      progress: this.props.fileRef.progress,
    }
  }
  componentDidMount() {
    this.props.fileRef.on('progress', this.onProgress)
  }
  componentWillDismount() {
    this.props.fileRef.off('progress', this.onProgress)
  }
  onProgress(progress) {
    this.setState({progress})
  }
  render() {
    if (this.state.progress === 1) {
      return null
    }
    let width = ((this.state.progress * 100) | 0) + '%'
    return (
      <div className='FileFetchProgress FileProgress'>
        <div className='FileFetchProgress-bar FileProgress-bar' style={{width}} />
      </div>
    )
  }
}

const FileRefListItem = ({fileRef, allowInput, selected, onSelect, onDelete}) => {
  let {name, type, isLocal} = fileRef
  let icon = icons[type] || defaultIcon
  let deleteButton = null
  let bottomContent = null

  let handleDelete = (event) => {
    event.stopPropagation()
    onDelete(fileRef)
  }

  let handleDownload = (event) => {
    event.stopPropagation()
    donwloadFile(fileRef.file)
  }

  if (isLocal) {
    bottomContent = (
      <FileTransferProgress fileRef={fileRef} />
    )
  } else {
    bottomContent = (
      <FileFetchProgress fileRef={fileRef} />
    )
  }
  if (allowInput) {
    deleteButton = (
      <span className='FileRefListItem-delete fa-stack fa-2x' onClick={handleDelete}>
        <Icon name='stop' stack='2x' />
        <Icon name='close' stack='1x' />
      </span>
    )
  }
  let className = 'FileRefListItem'
  if (selected) {
    className += ' FileRefListItem-selected'
  }
  return (
    <li className={className}>
      <div className='FileRefListItem-row FileRefListItem-top-row'>
        <Icon className='FileRefListItem-download' name='download' onClick={handleDownload}/>
        <div className='FileRefListItem-selectable' onClick={onSelect}>
          <img src={icon} className='FileRefListItem-icon'/>
          <span className='FileRefListItem-name'>{name}</span>
        </div>
        {deleteButton}
      </div>
      <div className='FileRefListItem-row FileRefListItem-bottom-row'>
        {bottomContent}
      </div>
    </li>
  )
}

const FileRefList = ({
  fileRefs,
  selectedFile,
  allowInput = false,
  onSelect,
  onDelete,
}) => {
  let className = 'FileRefList'
  if (allowInput) {
    className += ' FileRefList-allowInput'
  }
  return (
    <ul className={className}>
      {fileRefs.map((fileRef) => (
        <FileRefListItem
          key={fileRef.name}
          fileRef={fileRef}
          allowInput={allowInput}
          selected={selectedFile === fileRef}
          onSelect={() => allowInput && onSelect(fileRef)}
          onDelete={() => allowInput && onDelete(fileRef)}
        />
      ))}
    </ul>
  )
}

FileRefList.propTypes = {
  fileRefs: PropTypes.arrayOf(PropTypes.instanceOf(cct.FileRef)),
  allowInput: PropTypes.bool,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
}

FileRefList.Item = FileRefListItem
FileRefList.Progress = FileTransferProgress

export default FileRefList
