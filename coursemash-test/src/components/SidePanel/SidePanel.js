import React from 'react';
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';
import HelpChannel from './HelpChannel';


class SidePanel extends React.Component {

    render() {
        const { currentUser } = this.props;
        return (
            <Menu
                size="large"
                inverted
                fixed="left"
                vertical
                style={{ background: "#091b84", fontSize: "1.2rem" }}
            >
                <UserPanel currentUser={currentUser} />
                <Starred currentUser={currentUser} id="starredMesseges"/>
                <HelpChannel currentUser={currentUser} id="helpChannels" />
                <Channels currentUser={currentUser} />
                <DirectMessages currentUser={currentUser} />
            </Menu>
        )
    }
}

export default SidePanel;