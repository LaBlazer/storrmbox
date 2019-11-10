import React from 'react';
import { AuthContext } from '../../contexts/auth-context';
import LoginPage from '../../layout/pages/LoginPage';
import { getCookie, setCookie } from '../../utils/CookieHelper';
import { TOKEN_COOKIE_NAME, API_URL } from '../../configs/constants';
import Axios from 'axios';

class AuthWall extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
    }

    async componentDidMount() {
        var cookie = getCookie(TOKEN_COOKIE_NAME);
        if (cookie !== null) {
            try {
                this.setState({ loading: true });
                var data = await Axios.post(`${API_URL}/auth`, {}, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${cookie}`
                    }
                });

                if (data.status === 200) {
                    setCookie('atkn', data.data.token, new Date(data.data.expires_in * 1000));
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