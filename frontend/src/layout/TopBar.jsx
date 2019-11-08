import React from 'react';
import { Navbar } from 'react-bootstrap';
import logo from '../assets/images/logo.png';

class TopBar extends React.Component {

    render() {
        return (
            <Navbar bg="dark" variant="dark" className="mb-4">
                <Navbar.Brand href="#home">
                    <img
                        alt=""
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top mr-2"
                    />
                    {this.props.siteName}
                </Navbar.Brand>
            </Navbar>
        )
    }
}

TopBar.defaultProps = {
    siteName: "Web title"
}

export default TopBar;