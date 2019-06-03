import React from 'react';
import { Sidebar, Menu, Divider, Button } from 'semantic-ui-react';

class ColorPanel extends React.Component {
    render() {
        return (
            <Sidebar
                as={Menu}
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin"
                style={{ background: "#f4d835"}}
            >

            <Divider />
            <Button
                icon="add"
                size="small"
                style={{ background: "#ea02a8"}}
            />
            </Sidebar>
        )
    }
}

export default ColorPanel;