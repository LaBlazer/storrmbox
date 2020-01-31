import React from 'react';
import './sass/main.scss';

import AuthWall from './components/AuthWall/AuthWall';
import { BrowserRouter as Router } from "react-router-dom";

import MainPage from './layout/pages/MainPage';
import { UIErrorBoundary } from './layout/UIErrorBoundary';
import { GlobalNotificationHandler } from './layout/GlobalNotificationHandler/GlobalNotificationHandler';


class App extends React.Component {

    render() {
        return (
            <Router>
                <UIErrorBoundary>
                    <AuthWall>
                        <MainPage />
                    </AuthWall>
                    <GlobalNotificationHandler />
                </UIErrorBoundary>
            </Router>
        );
    }
}

export default App;
