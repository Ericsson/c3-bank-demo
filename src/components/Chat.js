
import React, {Component, PropTypes} from 'react';

function messageUrlFilter(text) {
  return text
    .split(/((?:^|\s)(?:http|https|ftp):\/\/[^\s]+(?:$|\s))/gi)
    .map((part, i) => {
      if (i % 2 === 1) {
        return <a className='ChatMessage-link' href={part} target='_blank'>{part}</a>;
      } else {
        return part;
      }
    })
}

const ChatMessage = ({message}) => {
  let body = messageUrlFilter(message.content.body)
  let time = new Date(message.timestamp).toLocaleTimeString()
  return (
    <div className={`ChatMessage ChatMessage-${message.isOwnEvent ? 'self' : 'peer'}`}>
      <p className='ChatMessage-body'>{body}</p>
      <div className='ChatMessage-meta'>
        <span className='ChatMessage-author'>{message.sender.name}</span>
        {' '}
        <span className='ChatMessage-time'>{time}</span>
      </div>
    </div>
  )
}

// TODO: handle scroll, new events, etc
class ChatMessageList extends Component {
  componentDidMount() {
    this.componentDidUpdate({messages: {length: -1}})
  }
  componentDidUpdate(newProps) {
    if (newProps.messages.length !== this.props.messages.length && this.list) {
      this.list.scrollTop = this.list.scrollHeight
    }
  }
  render() {
    return (
      <div className='ChatMessageList' ref={ref => this.list = ref}>
        {this.props.messages.map(event => <ChatMessage key={event.id} message={event}/>)}
      </div>
    )
  }
}

class ChatMessageInput extends Component {
  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(event) {
    event.preventDefault()
    if (this.props.onSendMessage) {
      let text = this.input.value
      this.input.value = ''
      this.props.onSendMessage(text)
    }
  }
  render() {
    return (
      <form className='ChatMessageInput' onSubmit={this.handleSubmit}>
        <input
          type='text'
          maxLength='5000'
          ref={ref => this.input = ref}
          placeholder='Send message...'
          className='ChatMessageInput-input'
        />
        <input
          type='submit'
          value='Send'
          className='ChatMessageInput-send-button'
        />
      </form>
    )
  }
}

class Chat extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSendMessage: PropTypes.func,
  }
  render() {
    let {messages, onSendMessage} = this.props
    return (
      <div className='Chat'>
        <ChatMessageList messages={messages}/>
        <ChatMessageInput onSendMessage={onSendMessage}/>
      </div>
    )
  }
}

export default Chat
