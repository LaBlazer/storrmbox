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
import { LoginItemModel, AuthService } from "endpoints/auth";
import { observable } from "mobx";
import { fetchGeoIPInfo } from "utils/geotool";

type PromiseReturn<T> = T extends Promise<infer U> ? U : T;

export interface LoginInfo extends LoginItemModel {
    geo: PromiseReturn<ReturnType<typeof fetchGeoIPInfo>>
}

@observer
export default class AccountPage extends Component {

    @observable
    loginList: LoginInfo[] | null = null;

    async componentDidMount() {
        let logins = await AuthService.list();

        let list = await Promise.all(logins.map((login) => new Promise<LoginInfo>(async (resolve) => {
            let geo = await fetchGeoIPInfo(login.ip);
            resolve({ geo, ...login });
        })))

        this.loginList = list;
    }

    render() {
        return <div id="account-page" className="pt-md-3">

            <section className="sidebar">
                <ListGroup variant="flush">
                    <NavLink to="/account" exact>
                        <ListGroup.Item>
                            <FontAwesomeIcon icon={faUserCog} />
                            <span className="item-text ml-3">Account overview</span>
                        </ListGroup.Item>
                    </NavLink>
                    <NavLink to="/account/security">
                        <ListGroup.Item>
                            <FontAwesomeIcon icon={faShieldAlt} />
                            <span className="item-text ml-3">Security</span>
                        </ListGroup.Item>
                    </NavLink>
                    <NavLink to="/account/invite">
                        <ListGroup.Item>
                            <FontAwesomeIcon icon={faTicketAlt} />
                            <span className="item-text ml-3">Invite friends</span>
                        </ListGroup.Item>
                    </NavLink>
                    {UserStore.user?.permission ?
                        <NavLink to="/account/admin">
                            <ListGroup.Item>
                                <FontAwesomeIcon icon={faHammer} />
                                <span className="item-text ml-3">Admin panel</span>
                            </ListGroup.Item>
                        </NavLink> : ""}
                </ListGroup>
            </section>

            <section className="main">
                <Switch>

                    <Route path="/account/security">
                        <AccountSecurity loginList={this.loginList} />
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