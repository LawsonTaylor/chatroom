import React, {
  Component
} from 'react'
import LoginPage from './components/LoginPage';
import ChatScreen from './components/ChatScreen/ChatScreen';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentScreen: 'WhatUsername',
      currentUsername: '',
    }
    this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this);
  }

  onUsernameSubmitted(username) {
    fetch('http://localhost:3001/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username
        }),
      })
      .then(response => {
        this.setState({
          currentUsername: username,
          currentScreen: 'ChatScreen',
        })
        console.log(response);
      })
      .catch(error => console.error('error', error))
  }

  render() {
      switch (this.state.currentScreen) {
        case 'WhatUsername':
          return (<LoginPage onSubmit={this.onUsernameSubmitted}/>);
        case 'ChatScreen':
          return ( <ChatScreen currentUsername = {
            this.state.currentUsername
          }
          />);
        default:
          return ( <div> Y no state </div>)
      }
  }
}

export default App;