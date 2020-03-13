import React from 'react';
import { Navbar, Button, Container, Form, FormControl, InputGroup, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import './TopBar.scss';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as SmallLogo } from '../../assets/logo_icon.svg';
import { NavLink, withRouter, Link, RouteComponentProps } from 'react-router-dom';
import AuthStore from '../../stores/AuthStore';
import { observer } from 'mobx-react';
import UserStore from 'stores/UserStore';

type TBProps = RouteComponentProps<{ query?: string }> & {
    siteName: string
}

type TBState = {
    searchQuery: string,
    isQueryInvalid: boolean
}

@observer
class TopBar extends React.Component<TBProps, TBState> {

    static defaultProps = {
        siteName: "Web title"
    }

    constructor(props: TBProps) {
        super(props);

        this.state = {
            searchQuery: this.props.match.params.query || "",
            isQueryInvalid: false
        }

        this.onSearch = this.onSearch.bind(this);
    }

    onSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (this.state.searchQuery.trim()) {
            this.props.history.push(`/search/${encodeURIComponent(this.state.searchQuery.trim())}`);
        }
        else {
            this.setState({ isQueryInvalid: true })
            setTimeout(() => this.setState({ isQueryInvalid: false }), 1000);
        }
    }

    render() {
        return (
            <Navbar bg="coal" variant="dark" className="top-bar" fixed="top" expand="lg">
                <Container className="justify-content-center">

                    <div className="navbar-brand w-50 mr-auto">
                        <Link to="/" className="d-inline-block" >
                            <Logo className="d-none d-md-inline fullsize" height="100%" width="100%" />
                            <p className="motd d-none d-md-block noselect">alpha</p>
                            <SmallLogo className="d-md-none smallsize" height="100%" width="100%" />
                        </Link>
                    </div>

                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav" className="w-100">
                        <ul className="navbar-nav w-100 justify-content-center noselect">
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
                        <div className="right navbar-nav ml-auto w-100 justify-content-end">
                            <Form inline onSubmit={this.onSearch} className="mb-2 mb-md-0">
                                <InputGroup>
                                    <FormControl
                                        type="text"
                                        placeholder="Search for content..."
                                        value={this.state.searchQuery}
                                        onChange={
                                            (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ searchQuery: e.target.value.replace(/^\s|(?<=\s)\s+/g, ''), isQueryInvalid: false })
                                        }
                                        className={this.state.isQueryInvalid ? 'invalid-form' : ''}
                                    />
                                    <InputGroup.Append>
                                        <Button type="submit" variant={this.state.isQueryInvalid ? 'outline-danger' : 'outline-primary'}>
                                            <FontAwesomeIcon icon={faSearch} />
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form>

                            <Dropdown alignRight>
                                <Dropdown.Toggle variant="outline-primary" className="ml-md-3 no-carret" id="user-menu-dropdown">
                                    <FontAwesomeIcon icon={faUser} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Header><FontAwesomeIcon icon={faUser} /> {UserStore.user?.username}</Dropdown.Header>
                                    <Link to="/account" style={{ textDecoration: 'none' }}>
                                        <Dropdown.Item as="button">
                                            Account
                                        </Dropdown.Item>
                                    </Link>
                                    <Dropdown.Item onClick={AuthStore.logout}>Sign out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

export default withRouter(TopBar);