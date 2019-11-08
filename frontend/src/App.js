import React from 'react';
import './sass/main.scss';

import AuthWall from './components/AuthWall/AuthWall';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthContextComponent } from './contexts/auth-context';

import MainPage from './layout/pages/MainPage';


class App extends React.Component {

    render() {
        return (
            <Router>
                <AuthContextComponent>
                    <AuthWall>
                        <Switch>
                            <Route path="/">
                                <MainPage />
                            </Route>
                        </Switch>
                    </AuthWall>
                </AuthContextComponent>
            </Router>
        );
    }
}

export default App;
