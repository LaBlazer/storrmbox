import React from 'react';
import LoginPage from '../../layout/pages/LoginPage';
import AuthStore from '../../stores/AuthStore';
import { observer } from 'mobx-react';

@observer
class AuthWall extends React.Component {

    state = {
        loading: false
    }

    componentDidMount() {
        AuthStore.refreshToken();
    }

    render() {
        var { auth } = AuthStore;

        if (auth === true) {
            return this.props.children;
        } else {
            if (this.state.loading) {
                return <React.Fragment></React.Fragment>
            } else {
                return (
                    <LoginPage />
                );
            }
        }
    }
}

export default AuthWall;