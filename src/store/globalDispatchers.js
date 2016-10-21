
// Not importing actions here to avoid hot-reload breakage

export default function registerGlobalDispatchers(store) {
  registerMediaQueryDispatcher(store.dispatch)
  registerDragAndDropDispatcher(store.dispatch)
}

function registerMediaQueryDispatcher(dispatch) {
  const mediaQuery = window.matchMedia('(min-aspect-ratio: 1/1)')

  if (mediaQuery.matches) {
    dispatch({type: 'SET_SCREEN_LAYOUT', screenLayout: 'landscape'})
  } else {
    dispatch({type: 'SET_SCREEN_LAYOUT', screenLayout: 'portrait'})
  }

  mediaQuery.addListener(() => {
    if (mediaQuery.matches) {
      dispatch({type: 'SET_SCREEN_LAYOUT', screenLayout: 'landscape'})
    } else {
      dispatch({type: 'SET_SCREEN_LAYOUT', screenLayout: 'portrait'})
    }
  })
}

function registerDragAndDropDispatcher(dispatch) {
  let enterCount = 0
  let isOver = false

  function getAcceptedFiles(event) {
    let {items = []} = event.dataTransfer
    return [...items]
      .filter(({type}) => type.match(/pdf|^image\//))
  }

  function setOver(newIsOver) {
    if (newIsOver !== isOver) {
      isOver = newIsOver
      dispatch({type: 'FILE_SHARE_DRAG_OVER', isOver})
    }
  }

  window.addEventListener('dragenter', (event) => {
    event.preventDefault()

    enterCount += 1
    if (getAcceptedFiles(event).length) {
      setOver(true)
    }
  })

  window.addEventListener('dragover', (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (getAcceptedFiles(event).length) {
      event.dataTransfer.dropEffect = 'copy'
    } else {
      event.dataTransfer.dropEffect = 'none'
    }
  })

  window.addEventListener('dragleave', (event) => {
    event.preventDefault()
    enterCount -= 1
    if (enterCount === 0) {
      setOver(false)
    }
  })

  window.addEventListener('drop', (event) => {
    event.preventDefault()
    let fileRefs = getAcceptedFiles(event)
      .map((file) => cct.FileRef.fromFile(file.getAsFile()))
    enterCount = 0
    setOver(false)
    if (fileRefs.length) {
      dispatch({type: 'FILE_SHARE_ADD_FILES', fileRefs})
    }
  })
}
