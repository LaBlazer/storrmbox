import React from 'react';
import { AuthContext } from '../../contexts/auth-context';
import LoginPage from '../../layout/pages/LoginPage';
import { getCookie, setCookie } from '../../utils/CookieHelper';
import { TOKEN_COOKIE_NAME, REMEMBER_ME_COOKIE_NAME } from '../../configs/constants';
import API from '../../utils/API';

class AuthWall extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }

        this.interceptor = null;
    }

    async componentDidMount() {

        //Check if user is not authorized
        this.interceptor = API.AxiosI.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    this.context.logout();
                }
            }

            return Promise.reject(error);
        });


        //Refresh token when site loads
        var cookie = getCookie(TOKEN_COOKIE_NAME);
        if (cookie !== null) {
            try {
                this.setState({ loading: true });
                var rememberMeCookie = getCookie(REMEMBER_ME_COOKIE_NAME);
                var rememberMe = (rememberMeCookie !== null && rememberMeCookie === "1");
                var data = await API.refreshToken(rememberMe);

                if (data.status === 200) {
                    setCookie(TOKEN_COOKIE_NAME, data.data.token, new Date(data.data.expires_in * 1000));
                    if (rememberMe) {
                        setCookie(REMEMBER_ME_COOKIE_NAME, 1, new Date(data.data.expires_in * 1000));
                    }
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

    componentWillUnmount() {
        if (this.interceptor != null)
            API.AxiosI.interceptors.response.eject(this.interceptor);
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