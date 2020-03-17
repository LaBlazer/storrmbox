import React, { Component } from "react";
import { LoginInfo } from "../AccountPage";
import "./AccountSecurity.scss";
import moment from "moment";
import { Button, Tooltip, OverlayTrigger, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, IconName } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "endpoints/auth";
import AuthStore from "stores/AuthStore";
import Emoji from "components/Emoji";

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
            <p className="big mb-4">Did you notice any suspicious activity? Don't worry, we've got your back! 
            Here are some things that will help you secure your account.</p>
            <h3 className="title">Previously signed from</h3>
            <div id="login-list">
                {
                    this.props.loginList?.length ? this.props.loginList?.map((login, i) => <div className="item" key={i}>
                        <div className="time">{moment(login.time).format("LLL")}</div>
                        <img src={login.geo.flag} className="flag" alt={`Flag of ${login.geo.country_name}`} />
                        <div className="location-name">{login.geo.country_name}{login.geo.region_name.length ? ` - ${login.geo.region_name}` : ''}</div>
                        <div className="ip">
                            <OverlayTrigger placement="bottom" overlay={
                                <Tooltip id="platform" style={{textTransform: "capitalize"}}>{login.platform}</Tooltip>
                            }>
                                <FontAwesomeIcon icon={["fab", login.platform as IconName]}/>
                            </OverlayTrigger>&nbsp;|&nbsp;
                            <OverlayTrigger placement="bottom" overlay={
                                <Tooltip id="platform" style={{textTransform: "capitalize"}}>{login.browser} {login.browser_version}</Tooltip>
                            }>
                                <FontAwesomeIcon icon={["fab", login.browser as IconName]}/>
                            </OverlayTrigger>&nbsp;|&nbsp;
                            {login.ip}
                        </div>
                    </div>
                    ) : (
                    <Alert variant="danger">
                        <Alert.Heading>Oh snap! Something is not right... <Emoji symbol="🤔" label="thinking"/></Alert.Heading>
                        <p> It seems that something is blocking our IP geolocation requests. You can try disabling adblocker and reloading the site. 
                        Don't worry, we don't serve ads anyway <Emoji symbol="😉" label="wink"/></p>
                    </Alert>
                    )
                }
            </div>
            <h3 className="title">Sign out of all devices</h3>
            <p>If you think someone has been using your account that you don't know you can sign out from devices where you were signed in.</p>
            <Button variant="warning" onClick={this.purgeData}><FontAwesomeIcon icon={faExclamationTriangle} /> Sign out off all devices</Button>
        </div>
    }
}