import React from 'react';
import firebase from '../../firebase';
import {Modal, Image} from 'semantic-ui-react';

class EditModal extends React.Component {

    state = {
        message: this.props.message,
        user: this.props.currentUser,
        modal: this.props.modal,

    }

    render() {
        const { message, user, modal } = this.state;

        return (
            <Modal basic open={this.state.modal} onClose={this.closeModal}>
                    <Modal.Header>Edit Post</Modal.Header>
                    <Modal.Content>
                        <Image src={message.user.avatar} width="60px"/>
                        <h2>{message.user.name}</h2>
                        <p>{message.messageId}</p>

                        {/* <Form onSubmit={this.handleSubmit}>
                            <Input
                                id="editInput"
                                type="text"
                                placeholder={message.content}
                                value={this.state.value}
                                fluid
                                onChange={this.handleChange} 
                            />
                            <Button 
                                type="submit" 
                                value="Submit" 
                                color="green" 
                                inverted
                                onClick={this.handleSubmit}
                            > 
                            <Icon name="save" /> Save Edit
                            </Button>
                            <Button color="red" inverted onClick={this.closeModal}>
                                <Icon name="remove" /> Cancel
                            </Button>
                        </Form> */}
                    </Modal.Content>
                </Modal>
        )
    }
};

export default EditModal;