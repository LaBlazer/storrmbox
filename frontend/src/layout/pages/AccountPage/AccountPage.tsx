import { faShieldAlt, faTicketAlt, faUserCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import { NavLink, Route, Switch } from "react-router-dom";
import "./AccountPage.scss";
import { AccountSecurity } from "./pages/AccountSecurity";
import { AccountSettings } from "./pages/AccountSettings";
import { Invites } from "./pages/Invites";

export default class AccountPage extends Component {
    render() {
        return <div id="account-page" className="pt-3">

            <section className="sidebar">
                <ListGroup variant="flush">
                    <NavLink to="/account" exact>
                        <ListGroup.Item><FontAwesomeIcon icon={faUserCog} className="mr-3" /> Account overview</ListGroup.Item>
                    </NavLink>
                    <NavLink to="/account/security">
                        <ListGroup.Item><FontAwesomeIcon icon={faShieldAlt} className="mr-3" /> Security</ListGroup.Item>
                    </NavLink>
                    <NavLink to="/account/invite">
                        <ListGroup.Item><FontAwesomeIcon icon={faTicketAlt} className="mr-3" /> Invite friends</ListGroup.Item>
                    </NavLink>
                </ListGroup>
            </section>

            <section className="main">
                <Switch>

                    <Route path="/account/security">
                        <AccountSecurity />
                    </Route>

                    <Route path="/account/invite">
                        <Invites />
                    </Route>

                    <Route path="/account">
                        <AccountSettings />
                    </Route>

                </Switch>
            </section>
        </div>;
    }
}