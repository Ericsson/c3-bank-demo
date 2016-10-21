
import React, {Component, PropTypes} from 'react'
import 'pdfjs-dist/build/pdf.combined'
import Editor from 'modules/pdfEditor'
import {NotificationManager} from 'react-notifications'
import {ProgressBar, VoidAnchor} from 'components'

export default class PdfEditor extends Component {
  static propType = {
    file: PropTypes.oneOf([
      PropTypes.instanceOf(Blob),
      PropTypes.instanceOf(File),
    ]),
    data: PropTypes.instanceOf(cct.DataShare).isRequired,
    onSignedDocument: PropTypes.func.isRequired,
  }
  constructor () {
    super()
    this.saveToPdf = this.saveToPdf.bind(this)
    this.setContainer = this.setContainer.bind(this)
    this.seqNum = 0
    this.state = {
      signing: false,
      progress: 0,
    }
  }
  setContainer(container) {
    this.container = container
    this.maybeRenderPdf()
  }
  componentWillReceiveProps(newProps) {
    if (this.pdfEditor) {
      this.pdfEditor.cancelRender()
    }
    this.loadFile(newProps.file)
  }
  componentWillMount() {
    this.loadFile(this.props.file)
  }
  componentWillUnmount() {
    this.seqNum += 1
    if (this.pdfEditor) {
      this.pdfEditor.cancelRender()
    }
  }
  maybeRenderPdf() {
    if (this.pdfEditor && this.container) {
      this.pdfEditor.renderTo(this.container, {
        onProgress: (progress) => this.setState({progress}),
      }).catch((error) => {
        if (error.message !== 'cancelled') {
          cct.log.error('meeting', 'failed to render pdf: ' + error)
          this.setState({progress: 0})
        }
      })
    }
  }
  bindDataToEditor() {
    let {data} = this.props
    let editor = this.pdfEditor
    editor.clearFormInputValues()
    editor.setFormInputListener((key, value) => {
      data.set(key, value)
    })
    if (data) {
      data.forEach((value, key) => {
        editor.setFormInputValue(key, value)
      })

      data.off('update')
      data.on('update', ({key, value}) => {
        editor.setFormInputValue(key, value)
      })
    }
  }
  loadFile(file) {
    this.seqNum += 1
    let seqNum = this.seqNum

    if (!file) {
      return
    }

    return Editor.loadFromFile(file)
      .then((pdfEditor) => {
        if (this.seqNum !== seqNum) {
          cct.log.debug('meeting', 'pdf load was outdated')
          return
        }
        this.pdfEditor = pdfEditor
        this.bindDataToEditor()
        this.maybeRenderPdf()
      })
      .catch((error) => {
        cct.log.error('meeting', 'failed to load PDF: ' + error)
      })
  }

  saveToPdf(){
    let pdfEditor = Editor.cloneFromEditor(this.pdfEditor)
    var pdfViewerDiv = document.createElement('div')
    pdfViewerDiv.classList.add('PdfEditor-document')
    pdfViewerDiv.classList.add('PdfEditor-render-document')
    document.body.appendChild(pdfViewerDiv)

    const renderWeight = 0.2
    const saveWeight = 1 - renderWeight
    this.setState({signing: true})

    return pdfEditor.renderTo(pdfViewerDiv, {
      scale: 2,
      onProgress: (progress) => this.setState({progress: progress * renderWeight}),
    }).then(() => {
      let name = this.props.file.name
      let signed = `-signed-${new Date().toLocaleString()}`
      let match = name.match(/^(.*)(\..+)$/)
      if (match) {
        name = `${match[1]}${signed}${match[2]}`
      } else {
        name = `${name}${signed}`
      }
      return pdfEditor.saveToPdf({
        name,
        onProgress: (progress) => {
          progress = renderWeight + progress * saveWeight
          if (Math.abs(progress - 1) < 0.0001) {
            progress = 1
          }
          this.setState({progress})
        },
      })
    }).then((fileRef) => {
      this.props.onSignedDocument(fileRef)
    }).catch((error) => {
      cct.log.error('meeting', 'failed to render pdf: ' + error)
      if (error.stack) {
        console.error(error.stack)
      }
      NotificationManager.error('Failed to render pdf: ' + error)
    }).then(() => {
      this.setState({signing: false})
      document.body.removeChild(pdfViewerDiv)
    })
  }

  render() {
    let {className = ''} = this.props
    let enabled = !this.state.signing
    let progress = this.state.progress
    let progressBar = null
    if (progress && progress < 1) {
      let loadingText = this.state.signing ? 'Signing' : 'Loading'
      progressBar = (
        <div className='PdfEditor--progressContainer'>
          <span className='PdfEditor--progress-text'>
            {loadingText}
          </span>
          <div className='PdfEditor--progress'>
            <ProgressBar progress={progress}/>
          </div>
        </div>
      )
    }
    return (
      <div className={`PdfEditor ${className}`}>
        <div className='PdfEditor--scrollContainer'>
          <div className='PdfEditor-document' ref={this.setContainer}/>
        </div>
        <div className='PdfEditor--footer'>
          <span onClick={enabled ? this.saveToPdf : null} className={`default-button sign-btn`}>
            Sign document
          </span>
          {progressBar}
        </div>
      </div>
    )
  }
}
