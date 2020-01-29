import React from 'react';
import LoginPage from '../../layout/pages/LoginPage/LoginPage';
import AuthStore from '../../stores/AuthStore';
import { observer } from 'mobx-react';
import { GrowLoader } from '../GrowLoader';
import { ReactComponent as Logo } from '../../assets/logo.svg';

@observer
class AuthWall extends React.Component {

    componentDidMount() {
        AuthStore.refreshToken();
    }

    render() {
        var { auth, fetching } = AuthStore;

        if (auth === true) {
            return this.props.children;
        } else {
            if (fetching) {
                return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span className="mb-2">
                        <Logo />
                    </span>
                    <GrowLoader size={4} />
                </div>
            } else {
                return (
                    <LoginPage />
                );
            }
        }
    }
}

export default AuthWall;