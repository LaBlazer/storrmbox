import React from 'react';
import { AuthContext } from '../../contexts/auth-context';
import LoginPage from '../../layout/pages/LoginPage';
import { getCookie, setCookie } from '../../utils/CookieHelper';
import { TOKEN_COOKIE_NAME } from '../../configs/constants';
import API from '../../utils/API';

class AuthWall extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
    }

    async componentDidMount() {
        //Refresh token when site loads
        var cookie = getCookie(TOKEN_COOKIE_NAME);
        if (cookie !== null) {
            try {
                this.setState({ loading: true });
                var data = await API.refreshToken();

                if (data.status === 200) {
                    setCookie(TOKEN_COOKIE_NAME, data.data.token, new Date(data.data.expires_in * 1000));
                    this.context.login();
                }

            } catch (err) {
                //Show error
                console.error(err);
            } finally {
                this.setState({ loading: false });
            }
        }
    }

    render() {
        //check for renewal token
        var { loggedIn } = this.context;

        if (loggedIn === true) {
            return (this.props.children)
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
AuthWall.contextType = AuthContext;

export default AuthWall;