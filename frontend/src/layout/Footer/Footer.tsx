import React from 'react';
import "./Footer.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { VERSION, GIT_COMMIT_HASH } from '../../configs/constants';

type FState = {
    clicks: number
}

export class Footer extends React.Component<any, FState> {

    state = {
        clicks: 0
    }

    handleClick = () => {
        this.setState((prevState) => {
            if (prevState.clicks === 9) {
                alert("You are now a developer!");
            }

            return { clicks: prevState.clicks + 1 }
        });
    }

    render() {
        return <div id="footer">
            <a href="https://github.com/LaBlazer/storrmbox" target="__blank" className="name">
                <FontAwesomeIcon icon={faGithub} /> Storrmbox
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <span className="version" onClick={this.handleClick}>{`${VERSION}.${GIT_COMMIT_HASH}`}</span>
        </div>
    }
}