import React from 'react';
import { Segment, Comment, Icon, Menu, Button, Modal, Input } from 'semantic-ui-react';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './ChannelMessage';


class Messages extends React.Component {

    state = {
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        helpChannel: this.props.isHelpChannel,
        messageRef: firebase.database().ref('messages'),
        messages: [],
        message: '',
        updatedMessage: '',
        messagesLoading: true,
        isStarredChannel: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        currentMessage: ''
    }

    componentDidMount() {
        const { channel, user } = this.state;

        if (channel && user) {
            this.addListeners(channel.id);
            this.addUserStarredListener(channel.id, user.uid);
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }

    addUserStarredListener = (channelId, userId ) => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if (data.val() !== null) {
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({ isStarredChannel: prevStarred });
                }
            })
    }


    getMessagesRef = () => {
        const { messageRef, privateMessagesRef, privateChannel, helpChannel } = this.state;
        return privateChannel ? privateMessagesRef : messageRef;
    }

    addMessageListener = channelId => {
        let loadedMessages =[];
        let ref = this.getMessagesRef();

        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
            this.countUniqueUsers(loadedMessages);
        })
    }


    handleStarredChannel =() => {
        this.setState(prevState => ({
            isStarredChannel: !prevState.isStarredChannel
        }), () => this.starredChannel());
    }

    starredChannel = () => {
        if (this.state.isStarredChannel) {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .update({
                    [this.state.channel.id] : {
                        name: this.state.channel.name,
                        details: this.state.channel.details,
                        createdBy: {
                            name: this.state.channel.createdBy.name,
                            avatar: this.state.channel.createdBy.avatar
                        }
                    }
                });
        } else {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .child(this.state.channel.id)
                .remove(err => {
                    if (err !== null) {
                        console.error(err);
                    }
                })
        }
    }

    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages());
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc,message) => {
            if (message.content && message.content.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, []);

        this.setState({ searchResults });
        setTimeout(() => this.setState({ searchLoading: false }), 1000);
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const plural= uniqueUsers.length > 1 || uniqueUsers.length === 0;
        const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
        this.setState({ numUniqueUsers });
    }

    displayMessages = (messages, getMessagesRef) => (
        messages.length > 0 && messages.map(message => (

                <Message 
                key={message.timestamp}
                message={message}
                user={this.state.user}
                currentChannel={this.state.channel}
                isPrivateChannel={this.state.privateChannel}
                isHelpChannel={this.state.isHelpChannel}
                getMessagesRef={this.getMessagesRef}
                />
                            
            
        ))
    )

    displayChannelName = channel => {
        return channel ? 
        `${this.state.privateChannel ? '@' : '#'}${channel.name}` 
        : '';
    };

    render() {
        const { 
            messageRef,
            messages,
            channel,
            user,
            numUniqueUsers,
            searchTerm,
            searchResults,
            searchLoading,
            privateChannel,
            isStarredChannel
        } = this.state;
        
        return (
            <React.Fragment>
                <MessagesHeader 
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={privateChannel}
                    handleStarredChannel={this.handleStarredChannel}
                    isStarredChannel={isStarredChannel}
                />

                <Segment id="message-container">
                    <Comment.Group className="messages">
                        {searchTerm ? this.displayMessages(searchResults) :
                        this.displayMessages(messages)
                        }
                    </Comment.Group>
                </Segment>

                <MessageForm 
                    messageRef={messageRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                />
            </React.Fragment>
        )
    }
}

export default Messages;