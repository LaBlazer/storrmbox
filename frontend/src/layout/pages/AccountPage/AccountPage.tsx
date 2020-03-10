import { faShieldAlt, faTicketAlt, faUserCog, faHammer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import { NavLink, Route, Switch } from "react-router-dom";
import "./AccountPage.scss";
import { AccountSecurity } from "./pages/AccountSecurity";
import { AccountSettings } from "./pages/AccountSettings";
import { Invites } from "./pages/Invites";
import UserStore from "stores/UserStore";
import { AdminPanel } from "./pages/AdminPanel";
import { observer } from "mobx-react";

@observer
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
                    {UserStore.user?.permission ? 
                    <NavLink to="/account/admin">
                        <ListGroup.Item><FontAwesomeIcon icon={faHammer} className="mr-3" /> Admin panel</ListGroup.Item>
                    </NavLink> : ""}
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

                    <Route path="/account/admin">
                        <AdminPanel />
                    </Route>

                    <Route path="/account">
                        <AccountSettings />
                    </Route>

                </Switch>
            </section>
        </div>;
    }
}