import React from 'react';
import { Segment, Accordion, Header, Icon, AccordionTitle, AccordionContent, Image } from 'semantic-ui-react';

class MetaPanel extends React.Component {
    
    state = {
        activeIndex: 0,
        key: this.props.key,
        channel: this.props.currentChannel,
        privateChannel: this.props.isPrivateChannel
    }

    setActiveIndex = (event, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex });
    }
    
    render() {
        const { activeIndex, privateChannel, channel } = this.state;

        if (privateChannel || !channel) return null;

        return (
            <Segment>
                <Header as="h3" attached="top">
                    About # {channel.name}
                </Header>
                <Accordion styled attached="true">
                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.setActiveIndex}
                    >

                    <Icon name="dropdown" />
                    <Icon name="info" />
                    Channel Details
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                    {channel.details}
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={this.setActiveIndex}
                    >

                    <Icon name="dropdown" />
                    <Icon name="user circle" />
                    Active Members
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                    @ Users
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 2}
                        index={2}
                        onClick={this.setActiveIndex}
                    >

                    <Icon name="dropdown" />
                    <Icon name="pencil alternate" />
                    Created by
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <Header as="h3">
                            <Image circular src={channel && channel.createdBy.avatar} />
                            @ {channel && channel.createdBy.name}
                        </Header>
                        
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 3}
                        index={3}
                        onClick={this.setActiveIndex}
                    >

                    <Icon name="dropdown" />
                    <Icon name="book" />
                    Course Content
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 3}>
                        <ul>
                            <li>
                                <Icon name="book"/>
                                <a href="" target="_blank">
                                Week 1 Content
                                </a>
                                <br />
                            </li>
                            <li>
                                <Icon name="book"/>
                                <a href="" target="_blank">
                                Week 2 Content
                                </a>
                            </li>
                            <li>
                                <Icon name="book"/>
                                <a href="" target="_blank">
                                Week 3 Content
                                </a>
                                <br />
                            </li>
                            <li>
                                <Icon name="book"/>
                                <a href="" target="_blank">
                                Week 4 Content
                                </a>
                            </li>
                            <li>
                                <Icon name="book"/>
                                <a href="" target="_blank">
                                Week 5 Content
                                </a>
                                <br />
                            </li>
                            <li>
                                <Icon name="book"/>
                                <a href="" target="_blank">
                                Week 6 Content
                                </a>
                            </li>
                            <li>
                                <Icon name="book"/>
                                <a href="" target="_blank">
                                Week 7 Content
                                </a>
                                <br />
                            </li>
                            <li>
                                <Icon name="book"/>
                                <a href="" target="_blank">
                                Week 8 Content
                                </a>
                            </li>

                            
                        </ul>
                    
                        
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 4}
                        index={4}
                        onClick={this.setActiveIndex}
                    >

                    <Icon name="dropdown" />
                    <Icon name="paperclip" />
                    Shared Docs
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 4}>
                        <ul>
                            <li>
                                <Icon name="paperclip"/>
                                <a href="" target="_blank">
                                myfile.docx
                                </a>
                                <br />
                            </li>
                            <li>
                                <Icon name="paperclip"/>
                                <a href="" target="_blank">
                                mydocument.pdf
                                </a>
                            </li>
                        </ul>
                    
                        
                    </Accordion.Content>
                </Accordion>
            </Segment>
        )
    }
}

export default MetaPanel;