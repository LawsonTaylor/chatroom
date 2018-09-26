import React, { Component } from 'react';
import { styles } from './styles';

class MessageStream extends Component {
  render(){
  return (
          <div
            style={{
              ...this.props.style,
              ...styles.container,
            }}
          >
            <ul style={styles.ul}>
              {this.props.messages.map((message, index) => (
                <li key={index} style={styles.li}>
                  <div>
                    <span style={styles.senderUsername}>{message.senderId}</span>{' '}
                  </div>
                  <p style={styles.message}>{message.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )
      }
    }
    export default MessageStream;