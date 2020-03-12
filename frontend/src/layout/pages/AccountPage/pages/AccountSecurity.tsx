import React, { Component } from "react";
import { LoginInfo } from "../AccountPage";
import "./AccountSecurity.scss";
import moment from 'moment';
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "endpoints/auth";
import AuthStore from "stores/AuthStore";

type ASProps = {
    loginList: LoginInfo[] | null;
}

export class AccountSecurity extends Component<ASProps> {

    purgeData = async () => {
        await AuthService.purge();
        AuthStore.logout();
    }

    render() {
        return <div>
            <h2 className="title">Account Security</h2>
            <p className="big mb-4">Security is important part of any software and we are definitely ANY.</p>
            <h3 className="title">Previously signed from</h3>
            <div id="login-list">
                {
                    this.props.loginList?.map((login, i) => <div className="item" key={i}>
                        <div className="time">{moment(login.time).format('LLL')}</div>
                        <img src={login.geo.flag} className="flag" alt={`Flag of ${login.geo.country_name}`} />
                        <div className="location-name">{login.geo.country_name}{login.geo.region_name.length ? ` - ${login.geo.region_name}` : ''}</div>
                        <div className="ip">{login.ip}</div>
                    </div>)
                }
            </div>
            <h3 className="title">Sign out of all devices</h3>
            <p>If you think someone has been using your account that you don't know you can sign out from devices where you were signed in.</p>
            <Button variant="warning" onClick={this.purgeData}><FontAwesomeIcon icon={faExclamationTriangle} /> Sign off all devices</Button>
        </div>
    }
}