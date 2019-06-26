import React from 'react';
import { Icon, Comment, Input, Modal, Button } from 'semantic-ui-react';
import firebase from '../../firebase';
import MessageForm from './MessageForm';

class EditTray extends React.Component {

    state = {
        message: this.props.message,
        messagesRef: firebase.database().ref('messages'),
        usersRef: firebase.database().ref('users'),
        messageId: this.props.message.messageId
    }

    editMessage = () => {
        const { getMessagesRef } = this.props;
        const { message, currentChannel,isPrivateChannel, messagesRef, messageId } = this.state;
        console.log("channel: ", message);
        // console.log("channel: ", currentChannel);
        console.log("messagesRef: ", message.messageId);

        // this.state.messagesRef
        //         .child(`${this.state.message.uid}`)
                // .update({
                //     [this.state.channel.id] : {
                //         name: this.state.channel.name,
                //         details: this.state.channel.details,
                //         createdBy: {
                //             name: this.state.channel.createdBy.name,
                //             avatar: this.state.channel.createdBy.avatar
                //         }
                //     }
                // });

        if (message) {
            const ref = `${messagesRef}/${messageId}`;
            // Send message.
            this.setState({ loading: true });

            var updatedMessages = {};
            var newMessage = {
                content: "Updating new message"
            }

           updatedMessages['/' + messageId] = newMessage;
        //    this.getMessagesRef()
        //         .put(updatedMessages)
        //         .then(() => {
        //             // this.setState({ loading: false, message: '', errors: [] })
        //             console.log("updated message");
        //         })
        //         .catch(err => {
        //             console.error(err);
        //             this.setState({ 
        //                 loading: false, 
        //                 errors: this.state.errors.concat(err)
        //             })
        //         })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'edit a message' })
            })
        }
    }

    getPath = () => {
        if (this.props.isPrivateChannel) {
            return `chat/private/${this.state.channel.id}`;
        } else {
            return 'chat/public';
        }
    }

    displayEditTray = () => (
        <div>
            <Input placeholder="edit your message here..."/>
        </div>
    )

    displayEditModal = () => (
        
        <Modal>
             <Modal.Header>Edit Message </Modal.Header>
                <Modal.Content>
                    <Input 
                        fluid
                        // onChange={this.addFile}
                        label="File Types: jpg, png"
                        name="file"
                        type="file"
                        value={this.state.message.content}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                        // onClick={this.sendFile}
                        color="green"
                        inverted
                    >
                    <Icon name="checkmark"/> Send
                    </Button>

                    <Button 
                        color="red" 
                        inverted
                        //onClick={closeModal}
                    >
                    <Icon name="remove"/> Cancel
                    </Button>
                </Modal.Actions>
        </Modal>
       
    )

    render() {
        const { message } = this.state;
        // console.log("editTray:", message);
        return (
            <Icon 
                name='edit' 
                onClick={this.editMessage}
            />
            
        )
    }
};

export default EditTray;