import React from 'react';
import './sass/main.scss';

import AuthWall from './components/AuthWall/AuthWall';
import { BrowserRouter as Router } from "react-router-dom";

import { AuthContextComponent } from './contexts/auth-context';

import MainPage from './layout/pages/MainPage';
import { UIErrorBoundary } from './layout/UIErrorBoundary';


class App extends React.Component {

    render() {
        return (
            <Router>
                <AuthContextComponent>
                    <UIErrorBoundary>
                        <AuthWall>
                            <MainPage />
                        </AuthWall>
                    </UIErrorBoundary>
                </AuthContextComponent>
            </Router>
        );
    }
}

export default App;
