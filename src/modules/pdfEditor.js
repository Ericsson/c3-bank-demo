'use strict'

import 'script!html2canvas'

export default class PdfEditor {
  constructor(pdf) {
    this.pdf = pdf
    this.formValues = {}
    this.formInputs = {}
    this.seqNum = 0
  }

  static loadFromFile(file) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    }).then((data) => window.PDFJS.getDocument({data}))
      .then((pdf) => new PdfEditor(pdf))
  }

  static cloneFromEditor(editor) {
    let newEditor = new PdfEditor(editor.pdf)
    newEditor.formValues = editor.formValues
    return newEditor
  }

  renderTo(element, {scale = 0, onProgress} = {}) {
    this.seqNum += 1
    let seqNum = this.seqNum
    this.element = element
    this.element.innerHTML = ''
    this.scale = scale
    this.onProgress = onProgress
    if (this.onProgress) {
      this.onProgress(0 / this.pdf.numPages)
    }
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
    this.resizeHandler = this.createResizeHandler(100)
    window.addEventListener("resize", this.resizeHandler);

    return this.renderPage(element, 1, seqNum)
  }

  cancelRender() {
    this.seqNum += 1
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
  }

  renderPage(element, pageNumber, seqNum) {
    let totalPages = this.pdf.numPages
    cct.log.verbose('pdf', `rendering page: ${pageNumber}/${totalPages}`)
    if (pageNumber > totalPages) {
      return // All pages rendered
    }
    if (this.seqNum !== seqNum) {
      cct.log.info('pdf', 'cancelling old pdf render job')
      return Promise.reject(new Error('cancelled'))
    }
    if (this.element !== element) {
      cct.log.warning('pdf', 'pdf render target changed, cancelling')
      return Promise.reject(new Error('cancelled'))
    }
    return this.renderSinglePage(element, pageNumber).then(() => {
      if (this.onProgress) {
        this.onProgress(pageNumber / totalPages)
      }
      return this.renderPage(element, pageNumber + 1, seqNum)
    })
  }

  renderSinglePage(div, pageNumber) {
    return this.pdf.getPage(pageNumber).then((page) => {
      let scale = this.scale

      if (scale === 0) {
        var divWidth = div.clientWidth
        var pageWidth = page.view[2]
        scale = divWidth / pageWidth
        cct.log.info('pdf', `page size: ${page.view}, viewer width: ${div.clientWidth}`)
      }
      cct.log.info('pdf', `rendering page with scale: ${scale} from configured scale: ${this.scale}`)
      var viewport = page.getViewport(scale)

      var pageDisplayWidth = viewport.width
      var pageDisplayHeight = viewport.height

      var pageDivHolder = document.createElement('div')
      pageDivHolder.className = 'pdfpage'
      pageDivHolder.style.width = pageDisplayWidth + 'px'
      pageDivHolder.style.height = pageDisplayHeight + 'px'
      div.appendChild(pageDivHolder)

            // Prepare canvas using PDF page dimensions
      var canvas = document.createElement('canvas')
      var canvasContext = canvas.getContext('2d')
      canvas.width = pageDisplayWidth
      canvas.height = pageDisplayHeight
      pageDivHolder.appendChild(canvas)

            // Prepare and populate form elements layer
      var formDiv = document.createElement('div')
      pageDivHolder.appendChild(formDiv)

      return this.setupForm(formDiv, page, viewport, scale)
        .then(() => {
          return page.render({canvasContext, viewport}).promise
        })
    })
  }

  setFormInputListener(formInputListener) {
    this.formInputListener = formInputListener
  }

  clearFormInputValues() {
    this.formValues = {}
  }

  setFormInputValue(key, value) {
    this.formValues[key] = value
    let input = this.formInputs[key]
    if (input) {
      if (input.type === 'checkbox') {
        input.checked = value
      } else if (!input.type || input.type === 'text') {
        input.value = value
      }
    }
  }

  bindInputItem(input, item) {
    this.formInputs[input.name] = input
    if (input.name in this.formValues) {
      var value = this.formValues[input.name]
      if (input.type === 'checkbox') {
        input.checked = value
      } else if (!input.type || input.type === 'text') {
        input.value = value
      }
    }
    if (input.type !== 'checkbox') {
      input.addEventListener('input', () => {
        this.formValues[input.name] = input.value
        if (this.formInputListener) {
          this.formInputListener(input.name, input.value)
        }
      })
    }
    input.addEventListener('change', () => {
      if (input.type === 'checkbox') {
        this.formValues[input.name] = input.checked
        if (this.formInputListener) {
          this.formInputListener(input.name, input.checked)
        }
      } else if (!input.type || input.type === 'text') {
        this.formValues[input.name] = input.value
        if (this.formInputListener) {
          this.formInputListener(input.name, input.value)
        }
      }
    })
  }

  setupForm(div, content, viewport, scale) {
    function createElementWithStyle(tagName, item) {
      var element = document.createElement(tagName)
      var rect = window.PDFJS.Util.normalizeRect(
              viewport.convertToViewportRectangle(item.rect))
      element.style.left = Math.floor(rect[0]) + 'px'
      element.style.top = Math.floor(rect[1]) + 'px'
      element.style.width = Math.ceil(rect[2] - rect[0]) + 'px'
      element.style.height = Math.ceil(rect[3] - rect[1]) + 'px'
      element.style.lineHeight = Math.ceil(rect[3] - rect[1]) + 'px'
      return element
    }
    function assignFontStyle(element, item) {
      var fontStyles = ''
      if ('fontSize' in item) {
        fontStyles += 'font-size: ' + Math.round(item.fontSize * viewport.fontScale) + 'px'
      }
      switch (item.textAlignment) {
        case 0:
          fontStyles += 'text-align: left'
          break
        case 1:
          fontStyles += 'text-align: center'
          break
        case 2:
          fontStyles += 'text-align: right'
          break
      }
      element.setAttribute('style', element.getAttribute('style') + fontStyles)
    }

    return content.getAnnotations().then((items) => {
      for (var i = 0; i < items.length; i++) {
        var item = items[i]
        switch (item.subtype) {
          case 'Widget':
            if (item.fieldType !== 'Tx' && item.fieldType !== 'Btn' &&
                item.fieldType !== 'Ch') {
              break
            }
            var inputDiv = createElementWithStyle('div', item)
            inputDiv.className = 'inputHint'
            div.appendChild(inputDiv)
            var input
            if (item.fieldType === 'Tx') {
              input = createElementWithStyle('input', item)
              if (!('fontSize' in item)) {
                input.style.fontSize = `${scale * 12}px`
              } else {
                item.fontSize *= scale
              }
            }
            if (item.fieldType === 'Btn') {
              input = createElementWithStyle('input', item)
              if (item.flags & 32768) {
                input.type = 'radio'
                        // radio button is not supported
              } else if (item.flags & 65536) {
                input.type = 'button'
                    // pushbutton is not supported
              } else {
                input.type = 'checkbox'
              }
            }
            if (item.fieldType === 'Ch') {
              input = createElementWithStyle('select', item)
                      // select box is not supported
            }
            input.className = 'inputControl'
            input.name = item.id
            input.title = item.alternativeText
            assignFontStyle(input, item)
            this.bindInputItem(input, item)
            div.appendChild(input)
            break
        }
      }
    })
  }

  saveToPdf({name, onProgress} = {}) {
    const pages = [...this.element.querySelectorAll('.pdfpage')]
    const renderedPages = []
    const renderContext = new window.jsPDF('p', 'pt', 'a4') // eslint-disable-line new-cap

    let progress = 0
    const totalProgress = pages.length * 3 + 1

    // First all pages are rendered to a canvas
    function processRenderQueue() {
      let nextPage = pages.shift()
      let renderedPage = window.html2canvas(nextPage)
      renderedPages.push(renderedPage)
      renderedPage.then((canvas) => {
        // signal progress after render call, since some async work is done as well
        if (onProgress) {
          progress += 1
          onProgress(progress / totalProgress)
        }
      })
      // signal progress after each render call, since it does some synchronous work
      if (onProgress) {
        progress += 1
        onProgress(progress / totalProgress)
      }
      return new Promise((resolve) => {
        // Use a timeout here to let the main loop run a bit between each render call
        setTimeout(resolve, 10)
      }).then(() => {
        if (pages.length) {
          return processRenderQueue()
        }
      })
    }

    function outputSinglePage(renderedPage) {
      return renderedPage.then((canvas) => {
        let {width, height} = renderContext.internal.pageSize
        let dataUrl = canvas.toDataURL('image/jpeg', 1.0 /*image quality*/)
        cct.log.debug('pdf', `rendering page: ${width}x${height}`)
        renderContext.addImage(dataUrl, 'JPEG', 0, 0, width, height)
      })
    }

    function processOutputQueue() {
      let nextPage = renderedPages.shift()
      return outputSinglePage(nextPage).then(() => {
        if (onProgress) {
          progress += 1
          onProgress(progress / totalProgress)
        }
        if (renderedPages.length) {
          renderContext.addPage()
          return processOutputQueue()
        }
      })
    }

    if (onProgress) {
      onProgress(progress / totalProgress)
    }

    return Promise.resolve()
      .then(processRenderQueue)
      .then(processOutputQueue)
      .then(() => {
        let blob = renderContext.output('blob')
        if (onProgress) {
          onProgress(1)
        }
        return cct.FileRef.fromBlob(name, blob)
      })
  }

/*  saveToPdf(name, {onProgress} = {}) {
    let pages = [...this.element.querySelectorAll('.pdfpage')]
    let canvasPromises = pages.map((element) => window.html2canvas(element), (error) => { throw (error) })
    let renderContext = new window.jsPDF('p', 'pt', 'a4') // eslint-disable-line new-cap

    return Promise.all(canvasPromises)
      .then((canvases) => {
        canvases.forEach((canvas, index) => {
          console.log('add index: ', index)
              //! If we're on anything other than the first page,
              // add another page
          if (index > 0) {
            console.log('adding page')
            renderContext.addPage()
          }

          let pdfInternals = renderContext.internal
          let pdfPageSize = pdfInternals.pageSize
          let {width, height} = pdfPageSize

          console.log('page number: ', renderContext.internal.getNumberOfPages())

          console.log('render page:', width, height)
          let dataUrl = canvas.toDataURL('image/jpeg', 1.0)
          renderContext.addImage(dataUrl, 'JPEG', 0, 0, width, height)
        })

        console.log('render complete: ', renderContext)
        renderContext.save(name)
      }, (error) => {
        throw (error)
      })
  }*/

  createResizeHandler(timeout) {
    let timer_id = 0
    let currentWidth = window.innerWidth
    return () => {
      if (timer_id !== 0) {
        clearTimeout(timer_id)
        timer_id = 0
      }
      timer_id = setTimeout(() => {
        timer_id = 0
        if (this.scale === 0) {
          if (currentWidth === window.innerWidth) {
            cct.log.debug('pdf', 'ignoring resize, width is the same')
            return
          }
          currentWidth = window.innerWidth
          this.seqNum += 1
          let seqNum = this.seqNum
          this.element.innerHTML = ''
          return this.renderPage(this.element, 1, seqNum)
            .catch((error) => {
              if (error.message !== 'cancelled') {
                cct.log.error('pdf', 'Resize render failed, ' + error)
              }
            })
        }
      }, timeout)
    }
  }
}
