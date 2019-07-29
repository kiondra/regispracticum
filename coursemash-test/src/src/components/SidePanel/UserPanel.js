import React from 'react';
import firebase from '../../firebase';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import { combineReducers } from 'redux';

class UserPanel extends React.Component {

    state = {
        user: this.props.currentUser
    }

    dropdownOptions = () => [
        {   
            key: 'user',
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'signout',
            text: <span onClick={this.handleSignout}>Sign out</span>
        }
        
    ]

    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => { 
                console.log("User signed out!");
            })
    }
    
    render() {
        const { user } = this.state;

        return(
            <Grid style={{ background: '#091b84' }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                        {/* App Header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="wechat"/>
                            <Header.Content>CourseMash</Header.Content>
                        </Header>
                        
                    {/* User Dropdown */}
                    <Header style={{ padding: '0.25em' }} as="h4" inverted>
                        <Dropdown trigger={
                            <span id="display__name">
                            <Image src={user.photoURL} spaced="right" avatar />
                            {user.displayName}
                            </span>
                        } options={this.dropdownOptions()} />
                    
                    </Header>
                    </Grid.Row>

                </Grid.Column>
            </Grid>
        );
    }
}

export default UserPanel;