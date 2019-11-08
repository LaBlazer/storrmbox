import React from 'react';
import { AuthContext } from '../../contexts/auth-context';
import LoginPage from '../../layout/pages/LoginPage';

class AuthWall extends React.Component {

    render() {
        //check for renewal token
        var { loggedIn } = this.context;

        if (loggedIn === true) {
            return (this.props.children);
        } else {
            return (
                <LoginPage />
            );
        }
    }

}
AuthWall.contextType = AuthContext;

export default AuthWall;