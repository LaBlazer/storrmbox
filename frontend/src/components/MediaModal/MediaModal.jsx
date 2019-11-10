import React from 'react';
import { Modal } from 'react-bootstrap';
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
                size="lg"
                centered>
                <div className="header">
                    <div className="top-thumbnail">
                        {/* <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/qYHp-5h1y5o?&showinfo=0&controls=0&autoplay=1&rel=0" frameBorder="0" allow="autoplay; encrypted-media"></iframe> */}
                        <img src={this.props.thumbnail} alt={this.props.name} />
                    </div>
                    <div className="info">
                        <p className="title">{this.props.name}</p>
                        <div className="rating">
                            <span>Year: {this.props.year}</span>
                            <span className="ml-2"> Rating: <StarRating stars={this.props.rating} /></span>
                        </div>
                    </div>
                    <p className="description">{this.props.description}</p>
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