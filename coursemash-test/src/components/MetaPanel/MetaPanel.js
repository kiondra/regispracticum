import React from 'react';
import { Segment, Accordion, Header, Icon, AccordionTitle } from 'semantic-ui-react';

class MetaPanel extends React.Component {
    
    state = {
        activeIndex: 0
    }

    // setActiveIndex = (event, titleProps)
    
    render() {
        // Const { activeIndex } = this.state;
        return (
            <Segment>
                <Header as="h3" attached="top">
                    About # Channel
                </Header>
                {/* <Accordion styled attached="true">
                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.setActiveIndex}
                    ></Accordion.Title>

                </Accordion> */}
            </Segment>
        )
    }
}

export default MetaPanel;