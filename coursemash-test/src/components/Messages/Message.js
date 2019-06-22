import React from 'react';
import moment from 'moment';
import { Comment, Image, Icon, Input } from 'semantic-ui-react';
import EditTray from './EditTray';

const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? 'message__self' : '';
}

const isImage = (message) => {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
}
const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({ message, user, getMessagesRef, currentChannel, isPrivateChannel }) => (
    <Comment>
        <Comment.Avatar src={message.user.avatar}/>
        <Comment.Content className={isOwnMessage(message, user)}>
            <Comment.Author as="a">{message.user.name}</Comment.Author>
            <Comment.Metadata>
            {timeFromNow(message.timestamp)}
         
            </Comment.Metadata>
            
            { isImage(message) 
                ? <Image src={message.image} className="message__image"/>
                : <Comment.Text>{message.content}</Comment.Text>
            
            }

            {/* <Comment.Actions>
                <Comment.Action >
                    <EditTray 
                    message={message} 
                    getMessagesRef={getMessagesRef}
                    currentChannel={currentChannel}
                    isPrivateChannel={isPrivateChannel}
                    />
                    
                </Comment.Action>
                <Comment.Action>
                     <Icon 
                        name='trash alternate'    
                    />
                    
                </Comment.Action>
            </Comment.Actions> */}

        </Comment.Content>

    </Comment>
   

) 

export default Message;
