import React from 'react';
import firebase from '../../firebase';
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';
import AvatarEditor from 'react-avatar-editor';
import { combineReducers } from 'redux';
import { thisTypeAnnotation } from '@babel/types';

class UserPanel extends React.Component {

    state = {
        user: this.props.currentUser,
        modal: false,
        previewImage: '',
        croppedImage: '',
        blob: '',
        uploadCroppedImage: '',
        storageRef: firebase.storage().ref(),
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref('users'),
        metadata: {
            contentType: 'image/jpeg'
        }
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });
    
 

    dropdownOptions = () => [
        {   
            key: 'user',
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span onClick={this.openModal}>Change Avatar</span>
        },
        {
            key: 'signout',
            text: <span onClick={this.handleSignout}>Sign out</span>
        }
        
    ]

    handleCropImage = () => {
        if (this.AvatarEditor) {
            this.AvatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({
                    croppedImage:imageUrl,
                    blob
                })
            })
        }
    };

    uploadCroppedImage = () => {
        const { storageRef, userRef, blob, metadata } = this.state;

        storageRef
            .child(`avatars/user-${userRef.uid}`)
            .put(blob, metadata)
            .then(snap => {
                snap.ref.getDownloadURL().then(downloadURL => {
                    this.setState({ uploadCroppedImage: downloadURL }, () => {
                        this.changeAvatar();
                    })
                })
            })
    }

    changeAvatar = () => {
        this.state.userRef 
            .updateProfile({
                photoURL: this.state.uploadCroppedImage
            })
            .then(() => {
                console.log('Photo updated');
                this.closeModal();
            })
            .catch(err => {
                console.error(err);
            })

        this.state.usersRef
            .child(this.state.user.uid)
            .update({ avatar: this.state.uploadCroppedImage })
            .then(()=> {
                console.log("Updated Avatar");
            })
            .catch(err => {
                console.error(err);
            })
    }

    handleChange = event => {
        const file = event.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                this.setState({ previewImage: reader.result });
            });
        }
    };

  
    handleSignout = () => {
        console.log("signing user out");
        firebase
            .auth()
            .signOut()
            .then(() => { 
                console.log("User signed out!");
            })
    }

    displayDate = () => {
        var today = new Date();
        
    }
    
    render() {
        const { user, modal, previewImage, croppedImage } = this.state;
        const { primaryColor } = this.props;

        return(
            <Grid style={{ background: '#091b84' }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                        {/* App Header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="graduation"/>
                            <Header.Content>CourseMash</Header.Content>
                        </Header>
                        
                    {/* User Dropdown */}
                    <Header style={{ padding: '1.2em' }} as="h4" inverted>
                        <Dropdown trigger={
                            <span id="display__name">
                            <Image src={user.photoURL} spaced="right" avatar />
                            {user.displayName}
                            </span>
                        } options={this.dropdownOptions()} />
                        
                    </Header>
                    <Header.Content style={{ color: '#ea02a8'}}>
                    <Icon name="book"/>
                    Regis MSSE 660
                    </Header.Content>
                    </Grid.Row>
                    <hr/>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                        {/* App Header */}
                        
                        <Header inverted floated="left" as="h2">
                            
                            <Header.Content>
                                {/* <h3>Weekly Highlight</h3> */}
                                    
                            </Header.Content>
                            <small>Tuesday, Jun 4 2019</small>
                        
                            <ul style={{fontSize: ".75em"}}>
                                <li>Task One</li>
                                <li>Task Two</li>
                            </ul>
                            <span><a href=""></a></span>
                        </Header>
                        
                    {/* User Dropdown */}
                    <Header style={{ padding: '0.25em' }} as="h4" inverted>
                       
                    
                    </Header>
                    </Grid.Row>

                    {/* Change Avatar Modal */}
                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>
                            <Input
                                onChange={this.handleChange} 
                                fluid
                                type="file"
                                label="New Avatar"
                                name="previewImage"
                            />
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                   <Grid.Column className="ui center aligned grid">
                                    {/* Image Preview */}
                                    {previewImage && (
                                        <AvatarEditor 
                                            ref={node => (this.AvatarEditor = node)}
                                            image={previewImage}
                                            width={120}
                                            height={120}
                                            border={50}
                                            scale={1.2}
                                        />
                                    )}
                                   </Grid.Column> 
                                   <Grid.Column>
                                       {/* Cropped Image Preview */}
                                       {croppedImage && (
                                           <Image 
                                                style={{ margin: '3.5em auto' }}  
                                                width={100}
                                                height={100}
                                                src={croppedImage}                                          
                                           />
                                       )}
                                   </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {croppedImage && <Button color="green" inverted onClick={this.uploadCroppedImage}>
                                <Icon name="save" /> Change Avatar
                            </Button>}
                            <Button color="green" inverted onClick={this.handleCropImage}>
                                <Icon name="image" /> Preview Avatar
                            </Button>
                            <Button color="red" inverted onClick={this.closeModal}>
                                <Icon name="remove" /> Cancel
                            </Button>
                        </Modal.Actions>

                    </Modal>
                    
                   
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserPanel;