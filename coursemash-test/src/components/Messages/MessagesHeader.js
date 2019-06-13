import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';


class MessagesHeader extends React.Component {
    render() {

        const { 
            channelName,
            numUniqueUsers,
            handleSearchChange,
            searchLoading,
            isPrivateChannel,
            handleStarredChannel,
            isStarredChannel
        } = this.props;

        return (
            <Segment clearing>
                {/* Channel Title */}
                <Header fluid="true" as="h2" floated="left" style={{ margin: 0 }}>
                    <span>
                        {channelName}
                        {!isPrivateChannel && (
                            <Icon 
                            onClick={handleStarredChannel}
                            name={isStarredChannel ? 'heart' : 'heart outline'} 
                            style={{ color: '#ea02a8' }}
                            />
                        )
                        }
                    </span>
                    <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>

                {/* Channel Search Input */}
                <Header floated="right">
                    <Input 
                        loading={searchLoading}
                        onChange={handleSearchChange}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Messages"
                    />
                </Header>
            </Segment>

        )
    }
}

export default MessagesHeader;
