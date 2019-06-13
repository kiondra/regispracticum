import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Menu, Icon } from 'semantic-ui-react';
import { thisTypeAnnotation } from '@babel/types';

class Starred extends React.Component {

    state = {
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        activeChannel: '',
        starredChannels: []
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    }

    addListeners = userId => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_added', snap => {
                const starredChannel = { id: snap.key, ...snap.val()};
                this.setState({
                    starredChannels: [...this.state.starredChannels, starredChannel]
                });
            });
        
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_removed', snap => {
                const starredChannelRemoved = { id: snap.key, ...snap.val()};
                const filteredChannels = this.state.starredChannels.filter(channel=> {
                    return channel.id !== starredChannelRemoved.id;
                });

                this.setState({ starredChannels: filteredChannels });
            })
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    }

    displayChannels = starredChannels => 
    starredChannels.length > 0 && starredChannels.map(starredChannel => (
            <Menu.Item
                key={starredChannel.id}
                onClick={() => this.changeChannel(starredChannel)}
                name={starredChannel.name}
                style={{ opacity: 0.9, color: "#f4d835"}}
                active={starredChannel.id === this.state.activeChannel}
                
            >
            # {starredChannel.name}

            </Menu.Item>
    ));

    render() {
        const { starredChannels } = this.state;
        return(
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="heart" /> FAVORITE
                    </span> { ' ' }
                    ({ starredChannels.length }) 
                </Menu.Item>
                {this.displayChannels(starredChannels)}
            </Menu.Menu>
        )
    }
}

export default connect(null, {setCurrentChannel, setPrivateChannel})(Starred);