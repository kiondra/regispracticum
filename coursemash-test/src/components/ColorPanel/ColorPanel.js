import React from 'react';
import firebase from '../../firebase';
import {
    Sidebar,
    Menu,
    Divider,
    Button,
    Icon,
    Modal,
    Label, 
    Segment
} from 'semantic-ui-react';
import { SliderPicker } from 'react-color';
import { thisTypeAnnotation } from '@babel/types';

class ColorPanel extends React.Component {

    state = {
        hide: false,
        modal: false,
        primary: '',
        secondary: '',
        user: this.props.currentUser,
        currentUserId: this.props.currentUser.uid,
        userColorTheme: [],
        usersRef: firebase.database().ref('users')
    }

    componentDidMount() {
        if (this.state.user) {
            console.log("Yes there is a user!");
            this.addUserListener(this.state.currentUserId);
        }
    }

    addUserListener = currentUserId => {
        let userColorTheme = [];
        this.state.usersRef
            .child(`${currentUserId}/colors`)
            .on('child_added', snap => {
                userColorTheme.unshift(snap.val());
                this.setState({ userColorTheme });
            })
            console.log('userColorTheme: ', userColorTheme);
    }

    openModal = () => this.setState({modal: true});

    closeModal = () => this.setState({modal: false});

    handlePrimaryChange = color => {
        this.setState({ primary: color.hex });
    };

    handleSecondaryChange = color => {
        this.setState({ secondary: color.hex });
    };

    saveColorHandler = () => {
        if (this.state.primary && this.state.secondary) {
            this.saveColors();
        }
    }

    saveColors = () => {
        console.log("currentUser: ", this.state.currentUserId);
        console.log("primary color for user: ", this.state.primary);
        console.log("secondary color for user: ", this.state.secondary);

        var themeColors = {
            primary: this.state.primary,
            secondary: this.state.secondary
        }

        this.state.usersRef
            .child(this.state.currentUserId)
            .child('colors')
            .update(themeColors)
            .then(() => {
                console.log('added color theme!');
                this.closeModal();
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

    displayThemeColors = userColorTheme => (
        userColorTheme.length > 0 && userColorTheme.map((color, i) => (
            <React.Fragment key={i}>
                <Divider />
                    <div className="color__container">
                        <div className="color__square" style={{ background: color.primary }}>
                            <div className="color__overlay" style={{ background: color.secondary }}></div>
                        </div>
                    </div>
            </React.Fragment>
        ))
    )

    render() {
        const { modal, primary, secondary, userColorTheme } = this.state;

        return (
            <Sidebar
                as={Menu}
                icon='labeled'
                inverted
                vertical
                visible
                width='very thin'
                style={{ background: '#f4d835'}}
            >

            <Divider />
            <Button
                icon="home"
                size="large"
                style={{ 
                    background: '#ea02a8',
                    marginLeft: '-6px',
                    marginBottom: '20px'
                }}
                onClick={this.openModal}
            />

            { this.displayThemeColors(userColorTheme) }

            <Button
                icon="content"
                size="large"
                style={{ 
                    background: '#ea02a8',
                    marginLeft: '-6px',
                    marginBottom: '20px'
                }}
            />

            <Button
                icon="heart"
                size="large"
                style={{ 
                    background: '#ea02a8',
                    marginLeft: '-6px',
                    marginBottom: '20px'
                }}
            />

            <Button
                icon="paperclip"
                size="large"
                style={{ 
                    background: '#ea02a8',
                    marginLeft: '-6px',
                    marginBottom: '20px'
                }}
            />

            <Button
                icon="tasks"
                size="large"
                style={{ 
                    background: '#ea02a8',
                    marginLeft: '-6px',
                    marginBottom: '20px'
                }}
            />

            <Button
                icon="at"
                size="large"
                style={{ 
                    background: '#ea02a8',
                    marginLeft: '-6px',
                    marginBottom: '20px'
                }}
            />
            
            <Button
                icon='add'
                size='large'
                style={{ background: '#ea02a8', marginLeft: '-6px'}}
            />

            {/* Color Picker Modal */}
            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header> Choose an app color</Modal.Header>
                <Modal.Content>
                <Segment inverted>
                    <Label content='Primary Color'/>
                    <SliderPicker 
                        color={ primary }
                        onChange={ this.handlePrimaryChange } 
                    />
                </Segment>

                <Segment inverted>
                    <Label content='Secondary Color'/>
                    <SliderPicker
                        color={ secondary }
                        onChange={ this.handleSecondaryChange }
                    />
                </Segment>

                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' inverted onClick={ this.saveColorHandler }>
                        <Icon name='checkmark'/> Save Colors
                    </Button>
                    
                    <Button color='red' inverted onClick={this.closeModal}>
                        <Icon name='remove' /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
            </Sidebar>
        )
    }
}

export default ColorPanel;