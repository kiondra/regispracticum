import React from 'react';
import { Sidebar, Menu, Divider, Button, Icon } from 'semantic-ui-react';

class ColorPanel extends React.Component {

    state = {
        hide: false
    }

    hideSection = () => {
        this.setState({ hide: true});
        var starredMesseges = document.getElementById("starredMesseges");
        console.log("hidding class");
    }

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
                icon="home"
                size="large"
                style={{ background: "#ea02a8", marginLeft: "-6px", marginBottom: "20px"}}
            />

            <Button
                icon="content"
                size="large"
                style={{ background: "#ea02a8", marginLeft: "-6px", marginBottom: "20px"}}
            />

            <Button
                icon="heart"
                size="large"
                style={{ background: "#ea02a8", marginLeft: "-6px", marginBottom: "20px"}}
            />

            <Button
                icon="paperclip"
                size="large"
                style={{ background: "#ea02a8", marginLeft: "-6px", marginBottom: "20px"}}
            />

            <Button
                icon="tasks"
                size="large"
                style={{ background: "#ea02a8", marginLeft: "-6px", marginBottom: "20px"}}
            />

            <Button
                icon="at"
                size="large"
                style={{ background: "#ea02a8", marginLeft: "-6px", marginBottom: "20px"}}
                onClick={this.hideSection}
            />
            
            <Button
                icon="add"
                size="large"
                style={{ background: "#ea02a8", marginLeft: "-6px"}}
            />
            </Sidebar>
        )
    }
}

export default ColorPanel;