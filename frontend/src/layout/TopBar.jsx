import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from '@fortawesome/free-solid-svg-icons'


class TopBar extends React.Component {

    render() {
        return (
            <Navbar bg="dark" variant="dark" className="mb-4">
                <Link to="/" className="navbar-brand">
                    <FontAwesomeIcon icon={faBolt} className="mr-2" />

                    {this.props.siteName}
                </Link>
            </Navbar>
        )
    }
}

TopBar.defaultProps = {
    siteName: "Web title"
}

export default TopBar;