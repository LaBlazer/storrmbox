import React from 'react';
import { Modal, Badge } from 'react-bootstrap';
import './MediaModal.scss';
import StarRating from '../../StarRating/StarRating';
import { ContentModel, ContenTypeMap } from '../../../endpoints/content';
import { MediaYear } from '../../MediaYear';
import { generateRGBColorsFromString, colorsToCSSRule } from '../../../utils/helpers';
import { getCookie } from '../../../utils/CookieHelper';

type MMProps = {
    content: ContentModel,
    onHide?: () => void
}

export class MediaModal extends React.Component<MMProps> {

    render() {
        let { type, poster, title, year_released, year_end, rating, genres, trailer_youtube_id } = this.props.content;
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
                    <div className="top-thumbnail">
                        {
                            (getCookie('trailers') != null) ?
                                <iframe title="youtube_tailer" width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${trailer_youtube_id}?&showinfo=0&controls=0&autoplay=1&rel=0`} frameBorder="0" allow="autoplay; encrypted-media"></iframe> :
                                <img src={poster} alt={title} />
                        }
                    </div>

                    <div className="info">
                        <p className="title">{title}</p>
                        <div className="spec">
                            <Badge className={`type type-${typeName} mr-2`}>{typeName}</Badge>
                            <span className="year mr-2">Year: <MediaYear type={type} year_released={year_released} year_end={year_end} /> </span>
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