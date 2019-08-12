import React from 'react';
import moment from 'moment';
import firebase from '../../firebase';
import { Comment, Image, Icon, Input, Modal, Button, Form } from 'semantic-ui-react';
import { thisTypeAnnotation } from '@babel/types';

class ChannelMessage extends React.Component {

    state = {
        key: this.props.key,
        message: this.props.message,
        messageRef: firebase.database().ref("messages"),
        replyRef: firebase.database().ref('reply'),
        messageId: this.props.message.messageId,
        usersRef: firebase.database().ref('users'),
        user: this.props.user,
        channel: this.props.currentChannel,
        modal: false,
        value: '',
        messages: []
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    isOwnMessage = (message, user) => {
        return message.user.id === user.uid ? 'message__self' : '';
    }
    
    isImage = (message) => {
        return message.hasOwnProperty('image') && 
            !message.hasOwnProperty('content');
    }

    isDocument = (message) => {
        return message.hasOwnProperty('document') &&
            !message.hasOwnProperty('content');
    } 
    
    timeFromNow = (timestamp) => moment(timestamp).fromNow();

    render() {
        const { message, user, modal } = this.state;

        return (
            <Comment>
                <Comment.Avatar src={this.state.message.user.avatar}/>
                <Comment.Content className={this.isOwnMessage(message, user)}>
                    <Comment.Author as="a">{message.user.name}</Comment.Author>
                    <Comment.Metadata>
                        {this.timeFromNow(message.timestamp)}
                    </Comment.Metadata>
                    
                    { this.isImage(message) 
                        ? <Image src={message.image} className="message__image"/>
                        : <Comment.Text>
                            <p id="comment-text">
                            <span id="message-content"> {message.content}</span>
                            </p>    
                        </Comment.Text>
                    }

                    { this.isDocument(message) 
                        ? <embed src={message.document} type="application/pdf"/>
                        : <Comment.Text>
                        </Comment.Text>
                    }

                </Comment.Content>

            </Comment>
        )
    }
};

export default ChannelMessage;