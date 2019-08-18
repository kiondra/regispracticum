import React from 'react';
import { Segment, Comment, Icon, Menu, Button, Modal, Input } from 'semantic-ui-react';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './ChannelMessage';
import Typing from './Typing';


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
        currentMessage: '',
        typingRef: firebase.database().ref('typing'),
        usersTyping: [],
        connectedRef: firebase.database().ref('.info/connected')
    }

    componentDidMount() {
        const { channel, user } = this.state;

        if (channel && user) {
            this.addListeners(channel.id);
            this.addUserStarredListener(channel.id, user.uid);
            this.getUserThemeColors();
        }
    }

    getUserThemeColors = () => {
        this.state.usersRef
            .child(this.state.user.uid)
            .child('colors')
            .once('value')
            .then(data => {
                if (data.val() !== null) {
                    const primaryColor = data.val().primary;
                    const secondaryColor = data.val().secondary;
                    this.setState({
                        primaryColor: primaryColor,
                        secondaryColor: secondaryColor
                    });
                }
            })
            .catch(err=> {
                console.error(err);
            })
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
        this.addTypingListener(channelId);
    }

    addTypingListener = channelId => {
        let usersTyping = [];

        this.state.typingRef
            .child(channelId)
            .on('child_added', snap =>  {
                if (snap.key !== this.state.user.uid) {
                    usersTyping = usersTyping.concat({
                        id: snap.key,
                        name: snap.val()
                    })
                    this.setState({ usersTyping });
                }
            })

        this.state.typingRef.on('child_removed', snap => {
            const index = usersTyping.findIndex(user => user.uid === snap.key);
            if (index !== -1) {
                usersTyping = usersTyping.filter(user => user.uid !== snap.key);
                this.setState({ usersTyping });
            }
        })

        this.state.connectedRef.on('value', snap => {
            if (snap.val() === true) {
                this.state.typingRef
                    .child(channelId)
                    .child(this.state.user.uid)
                    .onDisconnect()
                    .remove(err => {
                        if (err !== null) {
                            console.error(err);
                        }
                    })
                    
            }
        })
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
        const { messageRef, privateMessagesRef, privateChannel, helpChannel} = this.state;
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

    displayTypingUsers = usersTyping => {
        usersTyping > 0 && usersTyping.map(user => (
            <div style={{ display: "flex", alignItems: "center",
                marginBottom: '.2em' }} key={user.uid}>
                    <span className="user__typing"> {user.name} is typing</span>
                    <Typing></Typing>
            </div>
        ))

    }

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
            isStarredChannel,
            usersTyping
        } = this.state;

        const { primaryColor, secondaryColor } = this.props;
        
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
                        {searchTerm 
                            ? this.displayMessages(searchResults) 
                            : this.displayMessages(messages)
                        }

                       {this.displayTypingUsers(usersTyping)}

                    </Comment.Group>
                </Segment>

                <MessageForm 
                    messageRef={messageRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor} 
                />
            </React.Fragment>
        )
    }
}

export default Messages;