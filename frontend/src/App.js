import React from 'react';
import './sass/main.scss';

import AuthWall from './components/AuthWall/AuthWall';
import { BrowserRouter as Router } from "react-router-dom";

import { AuthContextComponent } from './contexts/auth-context';

import MainPage from './layout/pages/MainPage';


class App extends React.Component {

    render() {
        return (
            <Router>
                <AuthContextComponent>
                    <AuthWall>
                        <MainPage />
                    </AuthWall>
                </AuthContextComponent>
            </Router>
        );
    }
}

export default App;
