
// Uses thunk middleware to connect a map of listener function to an emitter
export function createEventConduit(events, dispatcher) {
  function eventListener(dispatch, event) {
    let args = []
    for (let index = 2; index < arguments.length; index += 1) {
      args.push(arguments[index])
    }
    dispatcher.call(this, dispatch, event, args)
  }

  let unsubscribe = null
  return {
    connect(target, dispatch) {
      if (unsubscribe) {
        unsubscribe()
      }
      if (!target) {
        return
      }

      let boundListeners = {}
      for (let index in events) {
        let name = events[index]
        boundListeners[name] = eventListener.bind(target, dispatch, name)
        target.on(name, boundListeners[name])
      }
      unsubscribe = () => {
        for (let index in events) {
          let name = events[index]
          target.off(name, boundListeners[name])
          dispatcher(dispatch, 'unsubscribe', [])
        }
        unsubscribe = null
      }
    },
  }
}
