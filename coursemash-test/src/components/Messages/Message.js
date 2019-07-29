import React from 'react';
import moment from 'moment';
import { Comment, Image, Icon, Input } from 'semantic-ui-react';
import EditTray from './EditTray';
import { thisTypeAnnotation } from '@babel/types';

const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? 'message__self' : '';
}

const isImage = (message) => {
    console.log("isImage message: ", message);
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
}

const isDocument = (message) => {
    console.log("isDocument message: ", message);
    return message.hasOwnProperty('document') && !message.hasOwnProperty('content');
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
                // ? <Document file={message.image} />
                : <Comment.Text>
                    <p id="comment-text"><span id="message-content">{message.content}</span></p>   
                </Comment.Text>
            
            }

        
            <Comment.Actions>
                {/* <Comment.Action >
                    <EditTray 
                    message={message} 
                    getMessagesRef={getMessagesRef}
                    currentChannel={currentChannel}
                    isPrivateChannel={isPrivateChannel}
                    />
                    
                </Comment.Action> */}
                <Comment.Action>
                     <Icon 
                        name='edit' 
                        onClick={() => {
                            console.log("you clicked, ", message.content)
                            var messageContent = document.getElementById("message-content");
                            var commentText = document.getElementById("comment-text");
                           
                            var editMessageInput = document.createElement('input');
                            editMessageInput.placeholder = `${ message.content }`;

                            commentText.append(editMessageInput);

                            messageContent.style.display = 'none'; 
                        }}   
                    />
                    
                </Comment.Action>
            </Comment.Actions>

        </Comment.Content>

    </Comment>
   

) 

export default Message;
