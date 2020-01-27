import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import './MediaModal.scss';
import StarRating from '../StarRating/StarRating';
import { ContentModel, Season } from '../../endpoints/content';
import { SeasonList } from '../SeasonList/SeasonList';
import { MediaYear } from '../MediaYear';

type MMProps = {
    seasons: Season[] | undefined | null,
    content: ContentModel,
    onHide?: () => void
}

class MediaModal extends React.Component<MMProps> {

    render() {
        let { type, poster, title, year_released, year_end, rating, plot } = this.props.content;

        return (
            <Modal
                show={true}
                onHide={this.props.onHide}
                dialogClassName="media-modal"
                aria-labelledby="example-custom-modal-styling-title"
                size="xl"
                centered
            >
                <div className="media-modal-header">
                    <div className="top-thumbnail">
                        {/* <iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${this.props.trailer_youtube_id}?&showinfo=0&controls=0&autoplay=1&rel=0`} frameBorder="0" allow="autoplay; encrypted-media"></iframe> */}
                        <img src={poster} alt={title} />
                    </div>

                    <div className="info">
                        <p className="title">{title}</p>
                        <div className="rating">
                            <span>Year: <MediaYear type={type} year_released={year_released} year_end={year_end} /> </span>
                            <span className="ml-2"> Rating: <StarRating stars={rating * 5} /></span>
                        </div>
                    </div>


                    {/* <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button> */}
                </div>
                <div className="media-modal-body">
                    <Row style={{ minHeight: "400px" }}>
                        <Col lg={5}>
                            <p className="description">{plot}</p>
                        </Col>
                        <Col lg={7}>
                            <SeasonList seasons={this.props.seasons} />
                        </Col>
                    </Row>
                </div>
            </Modal>
        )

    }
}

export default MediaModal;