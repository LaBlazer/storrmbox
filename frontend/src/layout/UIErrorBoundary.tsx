import React, { Component } from "react";
import { Button, Container } from "react-bootstrap";

export class UIErrorBoundary extends Component<any, { error: Error | null }> {

    state = {
        error: null
    }

    componentDidCatch(error: Error, info: { componentStack: string }) {
        this.setState({ error });

        window.onpopstate = function () {
            window.location.href = document.location.href;
        };

        console.error(error);
        console.error(info);
    }

    render() {
        if (this.state.error) {
            return <div className="center-container">
                <Container>
                    <h2>Ooops!</h2>
                    <h4>An error has occured!</h4>
                    <Button onClick={() => window.history.back()}>Return back</Button>
                </Container>
            </div>
        }

        return this.props.children;
    }

}