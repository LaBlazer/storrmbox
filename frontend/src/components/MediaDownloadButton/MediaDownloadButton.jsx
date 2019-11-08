import React, { Fragment } from 'react';
import { Button, ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt, faPlayCircle } from '@fortawesome/free-solid-svg-icons'

//Toto bude dobre vytiahnut do nejake inej triedy
//Stav filmu (je stiahnuty?)
export const MDBStates = {
    CANT_DOWNLOAD: -1,
    CAN_DOWNLOAD: 1,
    IS_DOWNLOADING: 2,
    CAN_WATCH: 3
};

export class MediaDownloadButton extends React.Component {

    render() {

        switch (this.props.state) {

            case MDBStates.CAN_DOWNLOAD:
                return (
                    <Button variant="outline-primary" onClick={this.props.onDownloadClick}>
                        <FontAwesomeIcon icon={faCloudDownloadAlt} />
                    </Button>
                )

            case MDBStates.CANT_DOWNLOAD:
                return (
                    <Button variant="outline-primary" disabled>
                        <FontAwesomeIcon icon={faCloudDownloadAlt} />
                    </Button>
                )

            case MDBStates.IS_DOWNLOADING:
                return  (
                    <ProgressBar now={this.props.percentsDownloaded} label={`${this.props.percentsDownloaded}%`} />
                )

            case MDBStates.CAN_WATCH:
                return (
                    <Button variant="success" onClick={this.props.onWatchClick}>
                        <FontAwesomeIcon icon={faPlayCircle} />
                    </Button>
                )

            default:
                return <Fragment></Fragment>;

        }

    }

}