import React from 'react';

export const AuthContext = React.createContext(false);

export class AuthContextComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            login: () => {
                this.setState({ loggedIn: true });
            },
            logout: () => {
                this.setState({ loggedIn: false });
            }
        };
    }

    render() {
        return (
            <AuthContext.Provider value={this.state}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }

}