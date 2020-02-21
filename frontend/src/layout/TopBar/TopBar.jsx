import React from 'react';
import { Navbar, Button, Container, Form, FormControl, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './TopBar.scss';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as SmallLogo } from '../../assets/logo_icon.svg';
import { NavLink, withRouter, Link } from 'react-router-dom';
import AuthStore from '../../stores/AuthStore';

class TopBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchValue: this.props.match.params.query || "",
            isSearchInvalid: false
        }

        this.onSearch = this.onSearch.bind(this);
    }

    componentDidUpdate(prevProps) {
        var prevQuery = prevProps.match.params.query,
            currQuery = this.props.match.params.query;

        if (this.state.searchValue !== "" && prevQuery !== undefined && prevQuery !== "" && currQuery === undefined) {
            this.setState({ searchValue: "" });
        }
    }

    onSearch(e) {
        e.preventDefault();
        var searched = this.state.searchValue.replace(/\s/g, ' ').trim();
        if (searched) {
            this.props.history.push(`/search/${encodeURIComponent(searched)}`);
        }
        else {
            this.setState({isSearchInvalid:true})
            setTimeout(() => this.setState({isSearchInvalid:false}), 2000);
        }
    }

    render() {
        return (
            <Navbar bg="coal" variant="dark" className="top-bar" fixed="top" expand="md">
                <Container>
                    
                    <Link to="/" className="navbar-brand">
                        <Logo className="d-none d-md-inline fullsize" height="100%" width="100%"/>
                        <p className="motd d-none d-md-block noselect">alpha</p>
                        <SmallLogo className="d-md-none smallsize" height="100%" width="100%"/>
                    </Link>                 
                    
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <ul className="navbar-nav mx-auto noselect">
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
                        <Form inline onSubmit={this.onSearch} className="mb-2 mb-md-0"> 
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    placeholder="Search text..."
                                    value={this.state.searchValue}
                                    onChange={e => this.setState({ searchValue: e.target.value, isSearchInvalid:false })}
                                    className={this.state.isSearchInvalid && 'invalid-form'}
                                />
                                <InputGroup.Append>
                                    <Button type="submit" variant={this.state.isSearchInvalid ? 'outline-danger' : 'outline-primary'}>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form>
                        <Button variant="outline-primary ml-md-3" onClick={AuthStore.logout}>Logout</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

TopBar.defaultProps = {
    siteName: "Web title"
}

export default withRouter(TopBar);