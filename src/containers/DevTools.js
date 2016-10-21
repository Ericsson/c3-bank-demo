
import React from 'react'
import {createDevTools} from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import SliderMonitor from 'redux-slider-monitor'
import Inspector from 'redux-devtools-inspector'
import DockMonitor from 'redux-devtools-dock-monitor'

class StateInspector extends Inspector {
  constructor(props) {
    super(props)
    this.state = {
      isWideLayout: false,
      selectedActionId: null,
      inspectedActionPath: [],
      inspectedStatePath: [],
      tab: 'State',
    }
  }
}

const DevTools = createDevTools(
  // <DockMonitor
  //   changeMonitorKey='meta-shift-j'
  //   toggleVisibilityKey='meta-j'
  //   changePositionKey='meta-alt-shift-j'
  //   defaultPosition='bottom'
  //   defaultIsVisible={false}
  // >
    <StateInspector />
    // <LogMonitor/>
    // <SliderMonitor/>
  // </DockMonitor>
)

export default DevTools
