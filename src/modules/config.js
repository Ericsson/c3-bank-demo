
// cct.log.setLogLevel('data-stream-interface', 20)
// cct.log.setLogLevel('remote-data-proxy', 20)
// cct.log.setLogLevel('local-data-proxy', 20)
// cct.log.setLogLevel('data-source', 20)
// cct.log.setLogLevel('call-registry', 20)
// cct.log.setLogLevel('call', 20)

cct.log.setLogLevel('meeting', cct.log.ALL)
cct.log.color = true

setTimeout(() => {
  PDFJS.verbosity = PDFJS.VERBOSITY_LEVELS.errors
})

export const iceServers = [{
  urls: 'turn:static.verkstad.net:443?transport=tcp',
  username: 'openwebrtc',
  credential: 'secret',
}]

//export const serverUrl = 'http://localhost:8008'
export const serverUrl = 'https://demo.cct.ericsson.net'

export const screenSharingFrameRate = 5
export const chromeExtensionId = 'cnmkhalfebkmaacaikplgjoeifnfplfb'
export const firefoxExtensionUrl = 'missing.xpi'
export const firefoxExtensionHash = 'tbd'

export const appIcons = {
  communicate: {
    id: 'communicate',
    name: 'video-camera',
    color: '#00285F',
  },
  present: {
    id: 'present',
    name: 'tv',
    color: '#00285F',
  },
  collaborate: {
    id: 'collaborate',
    name: 'file-text',
    color: '#00285F',
  },
  leave: {
    id: 'leave',
    name: 'phone',
    color: '#F00',
  },
}
