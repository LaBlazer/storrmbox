import React, { Component } from "react";
import DownloadStore from "../../../stores/DownloadStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { GrowLoader } from "../../GrowLoader";
import { observer } from "mobx-react";

type MPBProps = {
    uid: string,
    onButtonClick: () => void
}

@observer
export default class ModalPlayButton extends Component<MPBProps> {
    render() {
        let { uid, onButtonClick } = this.props;

        if (DownloadStore.downloads[uid] === undefined) {
            return <span className="play-button" >
                <FontAwesomeIcon icon={faPlayCircle} onClick={onButtonClick} />
            </span>
        } else if (DownloadStore.downloads[uid] === null) {
            return <span className="badge loading-video"><GrowLoader size={2} />  Video is being prepared...</span>
        }

        return null;
    }
}