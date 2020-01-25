import React from 'react';
import './sass/main.scss';

import AuthWall from './components/AuthWall/AuthWall';
import { BrowserRouter as Router } from "react-router-dom";

import MainPage from './layout/pages/MainPage';
import { UIErrorBoundary } from './layout/UIErrorBoundary';


class App extends React.Component {

    render() {
        return (
            <Router>
                <UIErrorBoundary>
                    <AuthWall>
                        <MainPage />
                    </AuthWall>
                </UIErrorBoundary>
            </Router>
        );
    }
}

export default App;
