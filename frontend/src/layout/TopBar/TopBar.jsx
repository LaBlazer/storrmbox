import React from 'react';
import { Navbar, Button, Container, Form, FormControl, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../../contexts/auth-context';
import { deleteCookie } from '../../utils/CookieHelper';
import { TOKEN_COOKIE_NAME, REMEMBER_ME_COOKIE_NAME } from '../../configs/constants';
import './TopBar.scss';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { NavLink, withRouter } from 'react-router-dom';

class TopBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchValue: this.props.match.params.query || ""
        }

        this.logout = this.logout.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidUpdate(prevProps) {
        var prevQuery = prevProps.match.params.query,
            currQuery = this.props.match.params.query;

        if (this.state.searchValue !== "" && prevQuery !== undefined && prevQuery !== "" && currQuery === undefined) {
            this.setState({ searchValue: "" });
        }
    }

    logout() {
        deleteCookie(TOKEN_COOKIE_NAME);
        deleteCookie(REMEMBER_ME_COOKIE_NAME);
        this.context.logout();
    }

    onSearch(e) {
        e.preventDefault();
        var searched = encodeURIComponent(this.state.searchValue.replace(/\s/g, ' '));
        this.props.history.push(`/search/${searched}`);
    }

    render() {
        return (
            <Navbar bg="coal" variant="dark" className="top-bar" fixed="top">
                <Container>
                    
                    <Navbar.Brand href="/">
                        <Logo height="100%" width="100%"/>
                    </Navbar.Brand>                 
                    
                    <div className="navbar-collapse collapse">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <NavLink to="/series" exact className="nav-link" activeClassName="active">
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
                        <Form inline onSubmit={this.onSearch}>
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    placeholder="Search text..."
                                    value={this.state.searchValue}
                                    onChange={(e) => this.setState({ searchValue: e.target.value })}
                                />
                                <InputGroup.Append>
                                    <Button type="submit" variant="outline-primary">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form>
                        <Button variant="outline-primary ml-3" onClick={this.logout}>Logout</Button>
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

export default withRouter(TopBar);