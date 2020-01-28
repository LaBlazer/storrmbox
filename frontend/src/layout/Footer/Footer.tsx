import React from 'react';
import "./Footer.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { VERSION, GIT_COMMIT_HASH } from '../../configs/constants';

export class Footer extends React.Component {
    render() {
        return <div id="footer">
            <a href="https://github.com/LaBlazer/storrmbox" target="__blank" className="name">
                <FontAwesomeIcon icon={faGithub} /> Storrmbox
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <span className="version">{`${VERSION}.${GIT_COMMIT_HASH}`}</span>
        </div>
    }
}