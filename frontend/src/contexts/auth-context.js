import React from 'react';

export const AuthContext = React.createContext(false);

export class AuthContextComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            auth: false,
            login: () => {
                this.setState({ auth: true });
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