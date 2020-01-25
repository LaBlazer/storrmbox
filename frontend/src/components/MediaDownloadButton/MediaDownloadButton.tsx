import React, { Fragment } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';
import './MediaDownloadButton.scss';
import RoundProgress from '../RoundProgress/RoundProgress';

//Toto bude dobre vytiahnut do nejake inej triedy
//Stav filmu (je stiahnuty?)
export enum MDBStates {
    CAN_DOWNLOAD = 1,
    IS_DOWNLOADING = 2,
    CAN_WATCH = 3
};

type MDBProps = {
    state: MDBStates,
    percentsDownloaded?: number,
    onDownloadClick?: (event: React.MouseEvent<SVGSVGElement>) => void,
    onWatchClick?: (event: React.MouseEvent<SVGSVGElement>) => void
}

export class MediaDownloadButton extends React.Component<MDBProps> {

    render() {

        switch (this.props.state) {

            case MDBStates.CAN_DOWNLOAD:
                return (
                    <div className="watch-overlay">
                        <FontAwesomeIcon className="icon" onClick={this.props.onDownloadClick} icon={faCloudDownloadAlt} />
                    </div>
                )

            case MDBStates.IS_DOWNLOADING:
                return (
                    <div className="watch-overlay">
                        <div className="icon h-5">
                            <RoundProgress value={this.props.percentsDownloaded} />
                        </div>
                    </div>
                )

            case MDBStates.CAN_WATCH:
                return (
                    <div className="watch-overlay">
                        <FontAwesomeIcon className="icon text-primary far" icon={faPlayCircle} onClick={this.props.onWatchClick} />
                    </div>
                )

            default:
                return <Fragment></Fragment>;

        }

    }

}