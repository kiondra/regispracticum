import React from 'react';
import UserPanel from './UserPanel';
import Channels from './Channels';
import { Menu } from 'semantic-ui-react';
import HelpChannel from '../../../components/SidePanel/HelpChannel';



class SidePanel extends React.Component {
    render() {
        const { currentUser } = this.props;
        return (
            <Menu
                size="large"
                inverted
                fixed="left"
                vertical
                style={{ background: "#091b84", fontSize: "1.2rem"}}
            >

                <UserPanel currentUser={currentUser} />
                <HelpChannel currentUser={currentUser} />
                <Channels currentUser={currentUser} />
            </Menu>
        )
    }
}

export default SidePanel;