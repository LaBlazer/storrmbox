import React, { Component } from "react";
import { Button } from "react-bootstrap";

export class UIErrorBoundary extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: null
        }
    }

    componentDidCatch(error, info) {
        this.setState({ error });

        console.error(error);
        console.error(info);
    }

    render() {
        if (this.state.error) {
            return <div className="text-center">
                <h2>Ooops!</h2>
                <h4>An error has occured!</h4>
                <Button onClick={() => window.location.reload()}>Refresh page</Button>
            </div>
        }

        return this.props.children;
    }

}