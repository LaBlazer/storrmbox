import PreAuthRouter from 'PreAuthRouter';
import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import AuthWall from './components/AuthWall/AuthWall';
import { GlobalNotificationHandler } from './layout/GlobalNotificationHandler/GlobalNotificationHandler';
import { UIErrorBoundary } from './layout/UIErrorBoundary';
import PostAuthRouter from './PostAuthRouter';
import './sass/main.scss';


class App extends React.Component {

    render() {
        return (
            <Router>
                <UIErrorBoundary>
                    <PreAuthRouter>
                        <AuthWall>
                            <PostAuthRouter />
                        </AuthWall>
                    </PreAuthRouter>
                    <GlobalNotificationHandler />
                </UIErrorBoundary>
            </Router>
        );
    }
}

export default App;
