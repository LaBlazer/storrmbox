import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import './MediaModal.scss';
import StarRating from '../StarRating/StarRating';


class MediaModal extends React.Component {
    render() {

        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                dialogClassName="media-modal"
                aria-labelledby="example-custom-modal-styling-title"
                size="xl"
                centered
            >

                <div className="header">
                    <div className="top-thumbnail">
                        {/* <iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${this.props.trailer_youtube_id}?&showinfo=0&controls=0&autoplay=1&rel=0`} frameBorder="0" allow="autoplay; encrypted-media"></iframe> */}
                        <img src={this.props.poster} alt={this.props.title} />
                    </div>

                    <div className="info">
                        <p className="title">{this.props.title}</p>
                        <div className="rating">
                            <span>Year: {this.props.date_released}</span>
                            <span className="ml-2"> Rating: <StarRating stars={this.props.rating * 5} /></span>
                        </div>
                    </div>

                    <Row style={{ minHeight: "400px" }}>
                        <Col md={4} >
                            <p className="description">{this.props.plot}</p>
                        </Col>
                        <Col md={8}>
                            Series & Episodes
                        </Col>
                    </Row>
                    {/* <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button> */}
                </div>
                <Modal.Body>
                </Modal.Body>
            </Modal>
        )

    }
}

export default MediaModal;