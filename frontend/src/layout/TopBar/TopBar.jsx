import React from 'react';
import { Navbar, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../../contexts/auth-context';
import { deleteCookie } from '../../utils/CookieHelper';
import { TOKEN_COOKIE_NAME, REMEMBER_ME_COOKIE_NAME } from '../../configs/constants';
import './TopBar.scss';
import { NavLink } from 'react-router-dom';

class TopBar extends React.Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        deleteCookie(TOKEN_COOKIE_NAME);
        deleteCookie(REMEMBER_ME_COOKIE_NAME);
        this.context.logout();
    }

    render() {
        return (
            <Navbar bg="coal" variant="dark" className="top-bar" fixed="top">
                <Container>
                    <Link to="/" className="navbar-brand">
                        <FontAwesomeIcon icon={faBolt} className="mr-2" />
                        {this.props.siteName}
                    </Link>
                    <div className="navbar-collapse collapse">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <NavLink to="/series" className="nav-link" activeClassName="active">
                                    Series
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/" exact className="nav-link" activeClassName="active">
                                    All
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/movies" className="nav-link" activeClassName="active">
                                    Movies
                                </NavLink>
                            </li>
                        </ul>
                        <Button variant="outline-primary" onClick={this.logout}>Logout</Button>
                    </div>
                </Container>
            </Navbar>
        )
    }
}

TopBar.contextType = AuthContext;

TopBar.defaultProps = {
    siteName: "Web title"
}

export default TopBar;