
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Icon, FileRefList, SplitContainer} from 'components'
import {MeetingFileViewer} from 'containers'
import {selectEditorFile, fileShareRemoveFile} from 'actions'
import {FileUploadBtn} from 'containers'

class MeetingViewCollaborate extends Component {
  render() {
    let {
      fileRefs,
      signedFiles,
      selectedFile,
      allowFileInput,
      onSelectFile,
      onDeleteFile,
    } = this.props
    console.log('SIGNED: ', signedFiles)
    let emptyDocs;
    if(signedFiles.length === 0) {
      emptyDocs = <p style={{fontStyle: "italic", marginLeft: '20px', fontWeight: '0'}}>No signed documents yet</p>
    }

    return (
      <SplitContainer direction='horizontal'>
        <MeetingFileViewer/>
        <SplitContainer className='MeetingViewCollaborate--files' direction='vertical'>
          <div className='MeetingViewCollaborate-file-list'>
            <div className="ClassControls">
              <div style={{display:"flex",alignItems: "center"}}>
                <span className='MeetingViewCollaborate-header'>
                    Open documents
                </span>
                <FileUploadBtn classes="fa fa-file-text file-upload-btn" styles={{fontSize: '2em'}}/>
              </div>
            </div>
            <FileRefList
              fileRefs={fileRefs}
              selectedFile={selectedFile}
              allowInput={allowFileInput}
              onSelect={onSelectFile}
              onDelete={onDeleteFile}
            />
            {!fileRefs.length && (
              <div className='MeetingViewCollaborate--fileDropArea'>
                Drop files here
              </div>
            )}
            <FileUploadBtn classes="fa fa-plus-circle plus-upload-btn" styles={{fontSize:'3em'}}/>
          </div>
          <div className='MeetingViewCollaborate-file-list'>
            <span className='MeetingViewCollaborate-header'>
              Signed documents <Icon name='check' />
            </span>
            {emptyDocs}
            <FileRefList fileRefs={signedFiles}/>
          </div>
        </SplitContainer>
      </SplitContainer>
    )
  }
}

export default connect(({meeting: {context, fileShare, signedShare, stateSync}}) => ({
  role: context.role,
  fileRefs: fileShare.fileRefs,
  signedFiles: signedShare.fileRefs,
  selectedFile: stateSync.editorFile,
  allowFileInput: context.role === 'advisor',
}), (dispatch) => ({
  onSelectFile: (fileRef) => dispatch(selectEditorFile(fileRef)),
  onDeleteFile: (fileRef) => dispatch(fileShareRemoveFile(fileRef)),
}))(MeetingViewCollaborate)
