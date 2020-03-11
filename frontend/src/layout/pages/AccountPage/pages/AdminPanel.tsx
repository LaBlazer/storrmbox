import { observer } from "mobx-react";
import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import UserStore from "stores/UserStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRadiation } from "@fortawesome/free-solid-svg-icons";
import { ContentService } from "endpoints/content";

@observer
export class AdminPanel extends Component {

    // @TODO delete this in next versions
    reloadContent__UNSAFE = () => {
        var r = window.confirm("Are you sure you want to realod content ? This will delete all cached data from the database!");
        if (r === true) {
            console.warn("Sending Reload request for content reloading!!!");
            ContentService.__reloadContent_UNSAFE();
        }
    }

    render() {
        if (!UserStore.user?.permission) {
            return <Redirect to='/account' />
        }

        return <div>
            <h2>Admin Panel</h2>
            <Button variant="danger" onClick={this.reloadContent__UNSAFE}>
                <FontAwesomeIcon icon={faRadiation} />&nbsp;&nbsp;Reload content
            </Button>
        </div>;
    }
}