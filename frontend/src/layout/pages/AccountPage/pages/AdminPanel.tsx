import React, { Component } from "react";
import { Button } from "react-bootstrap";
import ContentReloader from "components/ContentReloader";
import UserStore from "stores/UserStore";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";

@observer
export class AdminPanel extends Component {
    render() {
        if(!UserStore.user?.permission) {
            return <Redirect to='/account'/>
        }
        
        return <div>
            <h2>Admin Panel</h2>
            <Button variant="danger" onClick={() => <ContentReloader />}>Reload content</Button>
        </div>;
    }
}