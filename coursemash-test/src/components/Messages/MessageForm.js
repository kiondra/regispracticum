import React from 'react';
import uuidv4 from 'uuid/v4';
import firebase from '../../firebase';
import { Segment, Input, Button } from 'semantic-ui-react';

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';
import { now } from 'moment';

class MessageForm extends React.Component {
    state = {
        storageRef: firebase.storage().ref(),
        uploadTask: null,
        uploadState: '',
        percentUploaded: 0,
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false,
        getMessagesRef: this.props.getMessagesRef,
        messageId: '',
        messageIdCount: 0
        
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    createMessage = (fileUrl = null) => {
    //    this.state.messageIdCount++;
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            messageId: this.state.messageIdCount++,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
        };
        console.log("messageId:", message.messageId);


        if (fileUrl != null) {
            message['image'] = fileUrl;
        } else {
            message['content'] = this.state.message;
        }
        return message;
    }

    sendMessage = () => {
        const { getMessagesRef } = this.props;
        const { message, channel } = this.state;

        // const key = getMessagesRef.push().message.messageId;

        if (message) {
            // Send message.
            this.setState({ loading: true });
            getMessagesRef()
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] })
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ 
                        loading: false, 
                        errors: this.state.errors.concat(err)
                    })
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message' })
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

    uploadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.getMessagesRef();
        const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
            () => {
                this.state.uploadTask.on('state_changed', snap => {
                    const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
                    this.setState({ percentUploaded });
                },
                err => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        uploadState: 'error',
                        uploadTask: null
                    })
                },
                () => {
                    this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.sendFileMessage(downloadURL, ref, pathToUpload);
                    })
                    .catch(err => {
                        console.error(err);
                        this.setState({
                        errors: this.state.errors.concat(err),
                        uploadState: 'error',
                        uploadTask: null
                        })
                    })
                } 
            )
            }
        )
    };

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: 'done'})
            })
            .catch(err => {
                console.error(err);
                this.setState({
                errors: this.state.errors.concat(err),
                uploadState: 'error',
                uploadTask: null
                })
            }) 
    }

    render() {
        const { 
            errors,
            message,
            loading,
            modal,
            uploadState,
            percentUploaded,
        } = this.state;

        return(
            <Segment className="message_form">
                <Input
                    fluid
                    name="message"
                    onChange={this.handleChange}
                    value={message}
                    style={{ marginBottom: '0.7em' }}
                    label={ <Button icon={'add'} />}
                    labelPosition="left"
                    className={
                        errors.some(error => error.message.includes('message')) 
                        ? 'error'
                        : ''
                    }
                    placeholder="Write your message"
                />

                <Button.Group icon width="2">
                    <Button
                        onClick={this.sendMessage}
                        disabled={loading}
                        style={{ background: "#f4d835"}}
                        content="Add Message"
                        labelPosition="left"
                        icon="edit"
                    />
                    <Button
                        style={{ background: "#ea02a8"}}
                        disabled={uploadState === 'Uploading'}
                        onClick={this.openModal}
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />

                    
                </Button.Group>
                <FileModal 
                        modal={modal}
                        closeModal={this.closeModal}
                        uploadFile={this.uploadFile}
                />

                <ProgressBar 
                    uploadState={uploadState}
                    percentUploaded={percentUploaded}
                />
            </Segment>
        )
    }
}

export default MessageForm;