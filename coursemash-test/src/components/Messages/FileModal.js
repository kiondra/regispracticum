import React from 'react';
import mime from 'mime-types';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';

class FileModal extends React.Component {
    state = {
        file: null,
        authorized: [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint'
        ]
    }

    addFile = event => {
        const file = event.target.files[0];
        if (file) {
            this.setState({ file });
        }
    };

    sendFile = () => {
        const { file } = this.state;
        const { uploadFile, closeModal } = this.props;
        console.log("Sending file");

        if (file != null) {
            if (this.isAuthorized(file.name)) {
                //send file
                const metadata = { contentType: mime.lookup(file.name) };
                uploadFile(file, metadata);
                closeModal(); 
                this.clearFile();
            } else {
                console.log('file not authorized!!!');
            }
        }
    }

    isAuthorized = filename => this.state.authorized.includes(mime.lookup(filename));

    clearFile = () => this.setState({ file: null });

    render() {

        const { modal, closeModal } = this.props;

        return (
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>Select an File to Upload! </Modal.Header>
                <Modal.Content>
                    <Input 
                        fluid
                        onChange={this.addFile}
                        label="File Types: jpg, png, pdf"
                        name="file"
                        type="file"
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                        onClick={this.sendFile}
                        color="green"
                        inverted
                    >
                    <Icon name="checkmark"/> Send
                    </Button>

                    <Button 
                        color="red" 
                        inverted
                        onClick={closeModal}
                    >
                    <Icon name="remove"/> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default FileModal;