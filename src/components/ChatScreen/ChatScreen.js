import React, { Component } from "react";
import Chatkit from "@pusher/chatkit";
import MessageStream from '../MessageStream/MessageStream';
import SendMessageForm from '../SendMessageForm/SendMessage';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import styles from "./styles";

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      currentRoom: {},
      messages: [],
      usersWhoAreTyping: [],
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.sendTypingEvent = this.sendTypingEvent.bind(this);
  }

  sendMessage(text) {
    this.state.currentUser.sendMessage({
      text,
      roomId: this.state.currentRoom.id,
    });
  }

  sendTypingEvent(text){
    console.log("send typing event")
    console.log(this.state.currentUser);
    this.state.currentUser
      .isTypingIn({ roomId: this.state.currentRoom.id })
      .catch(error => console.error('Typing Indicator Error', error))
  }

  chatConnectError(error) {
    console.log("Chat Connect Error")
    console.log(error)
  }

  chatConnectSuccess(success){
    console.log("Chat Success");
    console.log(success);
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: "",
      userId: this.props.currentUsername,
      tokenProvider: new Chatkit.TokenProvider({
        url: "http://localhost:3001/authenticate"
      })
    });

    let es = {
      onSuccess: this.chatConnectSuccess,
      onError: this.chatConnectError
    }

    chatManager.connect(es)
      .then(currentUser => {
        console.log("connected...")
        console.log(currentUser)
        this.setState({ currentUser })
          return currentUser.subscribeToRoom({
            roomId: 17109609,
            messageLimit: 100,
            hooks: {
              onNewMessage: message => {
                this.setState({
                  messages: [...this.state.messages, message],
                })
              },
              onUserStartedTyping: user => {
                this.setState({
                  usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name],
                })
              },
              onUserStoppedTyping: user => {
                this.setState({
                  usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                    username => username !== user.name
                  ),
                })
              },
            },
          })
      })
      .then(currentRoom => {
        this.setState({currentRoom});
      })
      .catch(error => console.error("error", error));
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.chatContainer}>
          <aside style={styles.whosOnlineListContainer}>
            <h2>Who's online PLACEHOLDER</h2>
          </aside>
          <section style={styles.chatListContainer}>
            <h2>Chat PLACEHOLDER</h2>
            <MessageStream 
              messages={this.state.messages}
              style={styles.chatList}
            />
            <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping}/>
            <SendMessageForm 
              onSubmit={this.sendMessage} 
              onChange={this.sendTypingEvent}
            />
          </section>
        </div>
      </div>
    );
  }
}

export default ChatScreen;
