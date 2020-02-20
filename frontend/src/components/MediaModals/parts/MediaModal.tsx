import React, { Component } from 'react';
import { Modal, Badge } from 'react-bootstrap';
import './MediaModal.scss';
import StarRating from '../../StarRating/StarRating';
import { ContentModel, ContenTypeMap } from '../../../endpoints/content';
import { MediaYear } from '../../MediaYear';
import { generateRGBColorsFromString, colorsToCSSRule } from '../../../utils/helpers';
import { ModalTopThumbnail } from './ModalTopThumbnail';
import ModalPlayButton from './ModalPlayButton';
import DownloadStore from '../../../stores/DownloadStore';

type MMProps = {
    content: ContentModel,
    playContent?: boolean,
    onHide?: () => void
}

type MMState = {
    play: boolean
}

export class MediaModal extends Component<MMProps, MMState> {

    static defaultProps = {
        playContent: false
    }

    state = {
        play: false
    }

    componentDidUpdate() {
        if(this.props.playContent) {
            this.onPlayClicked();
        }
    }

    componentDidMount() {
        if(this.props.playContent) {
            this.onPlayClicked();
        }
    }

    onPlayClicked = () => {
        DownloadStore.download(this.props.content.uid);
    }

    render() {
        let { uid, type, poster, title, year_released, year_end, rating, genres, trailer_youtube_id } = this.props.content;
        let typeName = ContenTypeMap[type];

        return (
            <Modal
                show={true}
                onHide={this.props.onHide}
                dialogClassName="media-modal"
                size="xl"
                centered
            >
                <div className="media-modal-header">

                    <ModalTopThumbnail
                        uid={uid}
                        poster={poster}
                        title={title}
                        trailer_youtube_id={trailer_youtube_id}
                    />

                    <div className="info">
                        <div className="d-flex align-items-center">
                            <span className="title mr-auto">{title}</span>
                            <ModalPlayButton uid={uid} onButtonClick={this.onPlayClicked} />
                        </div>
                        <div className="spec">
                            <Badge className={`type type-${typeName.toLowerCase()} mr-2`}>{typeName}</Badge>
                            <span className="year mr-3">Year: <MediaYear type={type} year_released={year_released} year_end={year_end} /> </span>
                            <span className="rating mr-auto"> Rating: <StarRating stars={(rating ?? 0) * 0.5} /></span>
                            <span className="genres">
                                {
                                    genres?.split(",").map((genre) =>
                                        <Badge key={genre}
                                            className={`mr-1 ${genre}`}
                                            style={{ backgroundColor: colorsToCSSRule(generateRGBColorsFromString(genre)) }}
                                            variant="secondary">{genre}</Badge>
                                    )
                                }
                            </span>
                        </div>
                    </div>


                    {/* <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button> */}
                </div>
                <div className="media-modal-body">
                    {this.props.children}
                </div>
            </Modal>
        )

    }
}