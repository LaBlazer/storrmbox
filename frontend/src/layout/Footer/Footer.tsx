import React from 'react';
import "./Footer.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export class Footer extends React.Component {
    render() {
        return <div id="footer">
            <a href="https://github.com/LaBlazer/storrmbox" target="__blank" className="name">
                <FontAwesomeIcon icon={faGithub} /> Storrmbox
            </a>
        </div>
    }
}