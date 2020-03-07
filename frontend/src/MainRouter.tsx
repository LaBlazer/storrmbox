import React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

class MainRouter extends React.Component<RouteComponentProps> {

    render() {
        return (
            <Switch>

                <Route path="/invite">
                </Route>

                <Route path="/">
                    {this.props.children}
                </Route>

            </Switch>
        )
    }
}

export default withRouter(MainRouter);