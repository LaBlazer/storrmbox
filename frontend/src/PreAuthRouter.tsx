import React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import RegisterPage from 'layout/pages/RegisterPage/RegisterPage';

class PreAuthRouter extends React.Component<RouteComponentProps> {

    render() {
        return (
            <Switch>

                <Route path={["/invite/:code", "/invite"]}>
                    <RegisterPage />
                </Route>

                <Route path="/">
                    {this.props.children}
                </Route>

            </Switch>
        )
    }
}

export default withRouter(PreAuthRouter);