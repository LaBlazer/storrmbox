import React, { Component } from "react"
import { getCookie } from "../../../utils/CookieHelper";
import DownloadStore from "../../../stores/DownloadStore";
import { observer } from "mobx-react";
import VideoPlayer from "components/VideoPlayer";

type TTProps = {
    uid: string,
    poster: string,
    title: string,
    trailer_youtube_id: string
}

@observer
export class ModalTopThumbnail extends Component<TTProps> {

    render() {
        let { uid, poster, title, trailer_youtube_id } = this.props;
        let vURL = DownloadStore.downloads[uid];
        if (vURL) {
            return <div className="top-thumbnail video">
                <VideoPlayer title={title} url={vURL.data} />
            </div>
        }

        return <div className="top-thumbnail">
            {
                (getCookie('trailers') != null) ?
                    <iframe title="youtube_tailer"
                        width="100%"
                        height="100%"
                        src={`https://www.youtube-nocookie.com/embed/${trailer_youtube_id}?&showinfo=0&controls=0&autoplay=1&rel=0`}
                        frameBorder="0"
                        allow="autoplay; encrypted-media">
                    </iframe>
                    :
                    <img src={poster} alt={title} />
            }
        </div>

    }
}