import React, { Component } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { observer } from "mobx-react";
import { UserService } from "endpoints/user";
import Clipboard from 'react-clipboard.js';
import { observable } from "mobx";
import NotificationStore from "stores/NotificationStore";

@observer
export class Invites extends Component {
    @observable
    inviteCode: string | null | undefined;

    handleGenerating = async () => {
        try {
            this.inviteCode = null;
            let response = await UserService.invite();
            this.inviteCode = `${window.location.origin}/invite/${response.invite}`;
        } catch (err) {
            this.inviteCode = undefined;
        }
    }

    render() {
        return <div>
            <h2 className="title">Invite friends</h2>
            <p className="big">Does anybody from your friends wish to join and watch anything for free too?</p>

            {
                (this.inviteCode) ?
                    <Form.Group controlId="inviteLink">
                        <Form.Label>Invite link</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control type="text" value={this.inviteCode} readOnly />
                            <InputGroup.Append>
                                <Clipboard
                                    component="span"
                                    onSuccess={() => NotificationStore.addNotification({
                                        title: "Link copied",
                                        type: "info",
                                        text: "Invite link has been copied to the clipboard"
                                    }, 5000)}
                                    data-clipboard-text={this.inviteCode}>
                                    <Button variant="outline-secondary">Copy</Button>
                                </Clipboard>
                            </InputGroup.Append>
                        </InputGroup>
                        <Form.Text className="text-muted">
                            This invite link can be used only once! Be wise who you send it to :)
                            </Form.Text>
                    </Form.Group>
                    :
                    <div className="text-center">
                        <Button
                            onClick={this.handleGenerating}
                            disabled={this.inviteCode === null}
                        >
                            {this.inviteCode === undefined ? 'Generate an invite link' : 'Generating...'}
                        </Button>
                    </div>
            }

        </div>;
    }
}