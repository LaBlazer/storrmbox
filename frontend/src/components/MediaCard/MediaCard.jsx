import React from 'react';
import './MediaCard.scss';
import { Card, Row, Col } from 'react-bootstrap';
import FluidImage from '../FluidImage/FluidImage';
import { MediaDownloadButton, MDBStates as States } from '../MediaDownloadButton/MediaDownloadButton';
import StarRating from '../StarRating/StarRating';
import { Link, withRouter } from 'react-router-dom';

class MediaCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            state: States.CAN_DOWNLOAD,
            downloaded: 0
        }

        this.handleDownloadClick = this.handleDownloadClick.bind(this);
    }

    simulateDownloading() {
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

    handleDownloadClick() {
        this.setState({ state: States.IS_DOWNLOADING });

        this.simulateDownloading();
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.loading != nextProps.loading) {
            return true;
        }

        console.log("Card doesn't need update");
        
        return false;
    }

    render() {

        var card = (
            <Card className="media-card m-2">
                <Row className="no-gutters">
                    <Col className={this.state.state === States.IS_DOWNLOADING ? "image downloading" : "image"} sm={6} lg={4} >
                        <FluidImage className={this.props.loading ? '' : ''} src={this.props.poster} alt={this.props.title} />
                        <MediaDownloadButton
                            state={this.state.state}
                            onDownloadClick={this.handleDownloadClick}
                            percentsDownloaded={this.state.downloaded} />
                    </Col>
                    <Col className="info p-2 pt-3" sm={6} lg={8}>
                        {this.props.loading ?
                            <p className="title">&nbsp;</p>
                            :
                            <p className="title">{this.props.title}</p>
                        }
                        <StarRating stars={this.props.rating * 5} />
                    </Col>
                </Row>
            </Card>
        );

        if (this.props.uid) {
            return (
                <Link to={{ pathname: `/m/${this.props.uid}`, state: { background: this.props.location } }}>
                    {card}
                </Link>
            )
        } else {
            return card;
        }
    }
}

export default withRouter(MediaCard);