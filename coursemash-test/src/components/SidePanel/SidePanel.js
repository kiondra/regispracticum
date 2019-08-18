import React from 'react';
import { Menu } from 'semantic-ui-react';
import firebase from '../../firebase';

import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';
import HelpChannel from './HelpChannel';


class SidePanel extends React.Component {

    state = {
        userRef: firebase.database().ref('users'),
        currentUser: this.props.currentUser,
        currentUserId: this.props.currentUser.uid, 
        themeColorsRef: firebase.database().ref('users'),
    }


    getUserThemeColors = () => {
        this.state.userRef
            .child(this.state.currentUserId)
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

    render() {
        const { currentUser, currentUserId , userRef, primaryColor, secondaryColor} = this.props;
        return (
            <Menu
                size="large"
                inverted
                fixed="left"
                vertical
                style={{ background: primaryColor, fontSize: "1.2rem" }}
            >
                <UserPanel currentUser={currentUser} primaryColor={primaryColor} secondaryColor={secondaryColor}/>
                <Starred currentUser={currentUser} id="starredMesseges"/>
                <HelpChannel currentUser={currentUser} id="helpChannels" />
                <Channels currentUser={currentUser} />
                <DirectMessages currentUser={currentUser} />
               
            </Menu>
        )
    }
}

export default SidePanel;