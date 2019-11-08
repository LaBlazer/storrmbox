import React from 'react';
import './SearchResult.scss';
import { Card, Row, Col } from 'react-bootstrap';
import FluidImage from '../FluidImage/FluidImage';
import { MediaDownloadButton, MDBStates as States } from '../MediaDownloadButton/MediaDownloadButton';

class SearchResult extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            state: States.CAN_DOWNLOAD,
            downloaded: 0
        }

        this.handleDownloadClick = this.handleDownloadClick.bind(this);
    }

    handleDownloadClick() {
        this.setState({ state: States.IS_DOWNLOADING });

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
            <Card className="media-card">
                <Row className="no-gutters">
                    <Col className="image" sm={6} lg={4} >
                        <FluidImage src={this.props.data.image} alt={this.props.data.title} />
                    </Col>
                    <Col className="info p-2 pt-3" sm={6} lg={8}>
                        <p className="title">{this.props.data.title}</p>
                        <MediaDownloadButton
                            state={this.state.state}
                            onDownloadClick={this.handleDownloadClick}
                            percentsDownloaded={this.state.downloaded} />
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default SearchResult;