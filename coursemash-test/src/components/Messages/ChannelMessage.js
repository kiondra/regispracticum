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
        messageId: this.props.message.messageId,
        usersRef: firebase.database().ref('users'),
        user: this.props.user,
        channel: this.props.currentChannel,
        modal: false,
        value: '',
        messages: []
        

    }

    handleChange = event => {
        this.setState({value: event.target.value});
        // console.log("event.target.value: ", event.target.value);
      }
    
    handleSubmit = event => {
        this.setState ({ message: this.state.value});
        // event.preventDefault();
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    isOwnMessage = (message, user) => {
        // console.log("ownmessage: ", message);
        // console.log("ownuser: ", user);
        return message.user.id === user.uid ? 'message__self' : '';
    }
    
    isImage = (message) => {
        return message.hasOwnProperty('image') && 
            !message.hasOwnProperty('content');
    }
    
    timeFromNow = (timestamp) => moment(timestamp).fromNow();

    saveEditChanges = () => {
        console.log("saving edit changes")
    }

    handledDeleteMessage =() => {
        console.log("Deleting this message: ", this.state.message);
        this.state.message.content = '';
        // this.setState({ messageContent: ''});
        var channel = this.state.channel;

        var deletedMessageRef = firebase.database().ref(`messages/ + ${channel.id}` );

        // var ref = `${deletedMessageRef}/${this.state.messageId}`
        console.log("deletedMessageRef: ", deletedMessageRef);
        
        var message = this.state.message;
        var desiredId = message.messageId;
        var messageId = this.state.message.messageId;
        var ref = deletedMessageRef.orderByChild("messageId");
        // .equalTo(messageId)
        console.log("ref", ref.path[2]);
        var addMessage = 'checking database';

        // deletedMessageRef
        //     .child(ref)
        //     .put('newMessage', addMessage)
        //     .then(() => {
        //         console.log("new added message: ", addMessage);
        //     })
        //     .catch(err => {
        //         console.error(err);
        //     })


        // deletedMessageRef
        // .child(this.state.channel.id)
        // .once('value')
        // .then(data => {
        //     if (data.val() !== null) {
        //         const messageIds = Object.keys(data.val());
        //        console.log("messageIds: ", messageIds);
        //     }
        // })

        

        var messageKey = Object.keys(this.state.message);
        console.log("messageKey:", messageKey);

        //  this.state.deletedMessageRef
        //     .child(channel.id)
        //     .child()
        
    }


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
                            <span id="message-content">{message.content}</span>
                            </p>    
                        </Comment.Text>
                    }

                    <Comment.Actions>
                        <Comment.Action>
                            <Icon 
                                name='edit' 
                                onClick={this.openModal}   
                            />
                            
                        </Comment.Action>
                        <Comment.Action>
                            <Icon 
                                name='trash' 
                                onClick={this.handledDeleteMessage}   
                            />
                        </Comment.Action>
                    </Comment.Actions>

                    {/* Edit Post Modal */}
                    <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Edit Post</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Input
                                type="text"
                                placeholder={message.content}
                                value={this.state.value}
                                fluid
                                onChange={this.handleChange} 
                            />
                            <Button type="submit" value="Submit" color="green" inverted>
                            <Icon name="save" /> Save Edit
                            </Button>
                            <Button color="red" inverted onClick={this.closeModal}>
                                <Icon name="remove" /> Cancel
                            </Button>
                        </Form>
                    </Modal.Content>
                </Modal>

                </Comment.Content>

            </Comment>

    


        )
    }
};

export default ChannelMessage;