import React, { Component } from "react";
import { LoginInfo } from "../AccountPage";
import "./AccountSecurity.scss";
import moment from "moment";
import { Button, Tooltip, OverlayTrigger, Alert, Form, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, IconName } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "endpoints/auth";
import AuthStore from "stores/AuthStore";
import Emoji from "components/Emoji";
import { UserService } from "endpoints/user";
import { observable } from "mobx";
import { observer } from "mobx-react";
import NotificationStore from "stores/NotificationStore";

type ASProps = {
    loginList: LoginInfo[] | null;
}

@observer
export class AccountSecurity extends Component<ASProps> {

    @observable
    changePasswordResponse: any = {};

    handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let data = new FormData(e.currentTarget);

        try {
            await UserService.changePassword(data.get('currentPassword') as string, data.get('newPassword') as string, false);
            NotificationStore.addNotification({
                text: "You password was succesfuly changed. Please sign-in again.",
                title: "Password changed",
                type: "success"
            });
            AuthStore.logout();
        } catch (err) {
            if (err.response?.status === 400) {
                this.changePasswordResponse = err.response.data;
            }
        }

    }

    purgeData = async () => {
        await AuthService.purge();
        AuthStore.logout();
    }

    render() {
        return <div>
            <h2 className="title">Account Security</h2>
            <p className="big mb-4">Did you notice any suspicious activity? Don't worry, we've got your back!
            Here are some things that will help you secure your account.</p>

            <h3 className="title">Change your password</h3>
            <p>You can change your password and make your account more secure by using a better password.</p>
            <Form method="POST" id="change-password-form" onSubmit={this.handlePasswordChange}>
                <Form.Row>
                    <Form.Group as={Col} controlId="currentPassword">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="currentPassword"
                            placeholder="&bull;&bull;&bull;&bull;&bull;"
                            isInvalid={this.changePasswordResponse?.errors?.current_password}
                            required />
                        <div className="invalid-feedback">
                            {this.changePasswordResponse?.errors?.current_password}
                        </div>
                    </Form.Group>

                    <Form.Group as={Col} controlId="newPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="newPassword"
                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                            isInvalid={this.changePasswordResponse?.errors?.new_password}
                            required />
                        <div className="invalid-feedback">
                            {this.changePasswordResponse?.errors?.new_password}
                        </div>
                    </Form.Group>

                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="d-none d-sm-block">&nbsp;</Form.Label>

                            <Button variant="secondary" type="submit">
                                Change
                        </Button>
                        </Form.Group>
                    </Col>
                </Form.Row>
            </Form>

            <h3 className="title">Previously signed from</h3>
            <div id="login-list">
                {
                    this.props.loginList?.length ? this.props.loginList?.map((login, i) => <div className="item" key={i}>
                        <div className="time">{moment(login.time).format("LLL")}</div>
                        <img src={login.geo.flag} className="flag" alt={`Flag of ${login.geo.country_name}`} />
                        <div className="location-name">{login.geo.country_name}{login.geo.region_name.length ? ` - ${login.geo.region_name}` : ''}</div>
                        <div className="ip">
                            <OverlayTrigger placement="bottom" overlay={
                                <Tooltip id="platform" style={{ textTransform: "capitalize" }}>{login.platform}</Tooltip>
                            }>
                                <FontAwesomeIcon icon={["fab", login.platform as IconName]} />
                            </OverlayTrigger>&nbsp;|&nbsp;
                            <OverlayTrigger placement="bottom" overlay={
                                <Tooltip id="platform" style={{ textTransform: "capitalize" }}>{login.browser} {login.browser_version}</Tooltip>
                            }>
                                <FontAwesomeIcon icon={["fab", login.browser as IconName]} />
                            </OverlayTrigger>&nbsp;|&nbsp;
                            {login.ip}
                        </div>
                    </div>
                    ) : (
                            <Alert variant="danger">
                                <Alert.Heading>Oh snap! Something is not right... <Emoji symbol="🤔" label="thinking" /></Alert.Heading>
                                <p> It seems that something is blocking our IP geolocation requests. You can try disabling adblocker and reloading the site.
                        Don't worry, we don't serve ads anyway <Emoji symbol="😉" label="wink" /></p>
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