import React from 'react';
import './App.scss';
import Header from './components/header/Header';

import { BrowserRouter as Router } from "react-router-dom";

import { AuthContextComponent } from './contexts/auth-context';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <AuthContextComponent>
                    <Header></Header>
                </AuthContextComponent>
            </Router>
        );
    }
}

export default App;
