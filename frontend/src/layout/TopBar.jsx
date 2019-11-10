import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../contexts/auth-context';
import { deleteCookie } from '../utils/CookieHelper';
import { TOKEN_COOKIE_NAME } from '../configs/constants';


class TopBar extends React.Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        deleteCookie(TOKEN_COOKIE_NAME);
        this.context.logout();
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark" className="mb-4">
                <Link to="/" className="navbar-brand">
                    <FontAwesomeIcon icon={faBolt} className="mr-2" />
                    {this.props.siteName}
                </Link>
                <div className="navbar-collapse collapse">
                    <Button variant="outline-primary" className="ml-auto" onClick={this.logout}>
                        Logout
                    </Button>
                </div>
            </Navbar>
        )
    }
}

TopBar.contextType = AuthContext;

TopBar.defaultProps = {
    siteName: "Web title"
}

export default TopBar;