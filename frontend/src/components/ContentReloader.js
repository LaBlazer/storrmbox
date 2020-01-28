import React from 'react';
import { ContentService } from "../endpoints/content";
import { Redirect } from 'react-router-dom';


/**
 * @todo DELETE THIS IN PRODUCTION. Used only in development
 */
export default class ContentReloader extends React.Component {

    state = {
        redirect: false
    }

    componentDidMount() {
        console.warn("Sending Reload request for content reloading!!!");
        
        ContentService.__reloadContent_UNSAFE();
        this.setState({redirect: true});
    }

    render() {
        if(this.state.redirect) {
            return <Redirect to="/" />
        }

        return null;
    }

}