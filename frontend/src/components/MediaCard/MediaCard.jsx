import React from 'react';
import './MediaCard.scss';
import { Card, Row, Col } from 'react-bootstrap';
import FluidImage from '../FluidImage/FluidImage';
import { MediaDownloadButton, MDBStates as States } from '../MediaDownloadButton/MediaDownloadButton';
import MediaModal from '../MediaModal/MediaModal';

class MediaCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            state: States.CAN_DOWNLOAD,
            downloaded: 0,
            showModal: false
        }

        this.handleDownloadClick = this.handleDownloadClick.bind(this);
    }

    handleDownloadClick() {
        this.setState({ state: States.IS_DOWNLOADING });

        //Simulate downloading
        var inter = setInterval(() => {

            if (this.state.downloaded < 100) {

                this.setState((state) => ({
                    downloaded: state.downloaded + parseInt(Math.random() * 10)
                }));
            } else {
                this.setState({ state: States.CAN_WATCH });
                clearInterval(inter);
            }

        }, 500);
    }

    render() {
        return (
            <React.Fragment>
                <Card className="media-card" onClick={() => this.setState({ showModal: true })}>
                    <Row className="no-gutters">
                        <Col className={this.state.state === States.IS_DOWNLOADING ? "image downloading" : "image"} sm={6} lg={4} >
                            <FluidImage src={this.props.data.image} alt={this.props.data.title} />
                            <MediaDownloadButton
                                state={this.state.state}
                                onDownloadClick={this.handleDownloadClick}
                                percentsDownloaded={this.state.downloaded} />
                        </Col>
                        <Col className="info p-2 pt-3" sm={6} lg={8}>
                            <p className="title">{this.props.data.title}</p>
                            <small>{this.props.data.size}</small>
                        </Col>
                    </Row>
                </Card>
                <MediaModal show={this.state.showModal} onHide={() => this.setState({ showModal: false })} 
                    mediaTitle={this.props.data.title} mediaDescription={this.props.data.description} />
            </React.Fragment>
        );
    }
}

export default MediaCard;