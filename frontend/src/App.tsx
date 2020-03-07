import MainRouter from 'MainRouter';
import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import AuthWall from './components/AuthWall/AuthWall';
import { GlobalNotificationHandler } from './layout/GlobalNotificationHandler/GlobalNotificationHandler';
import { UIErrorBoundary } from './layout/UIErrorBoundary';
import MainContentRouter from './MainContentRouter';
import './sass/main.scss';


class App extends React.Component {

    render() {
        return (
            <Router>
                <UIErrorBoundary>
                    <MainRouter>
                        <AuthWall>
                            <MainContentRouter />
                        </AuthWall>
                    </MainRouter>
                    <GlobalNotificationHandler />
                </UIErrorBoundary>
            </Router>
        );
    }
}

export default App;
