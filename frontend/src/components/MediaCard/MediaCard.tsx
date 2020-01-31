import React from 'react';
import './MediaCard.scss';
import { Card, Row, Col, Image } from 'react-bootstrap';
import { MediaDownloadButton, MDBStates } from '../MediaDownloadButton/MediaDownloadButton';
import StarRating from '../StarRating/StarRating';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

type MediaCardProps = RouteComponentProps<{}> & {
    loading?: boolean,
    uid?: string,
    title?: string,
    poster?: string,
    rating?: number,
    plot?: string
}

type MediaCardState = {
    state: MDBStates,
    downloaded: number
}

class MediaCard extends React.Component<MediaCardProps, MediaCardState> {

    constructor(props: MediaCardProps) {
        super(props);

        this.state = {
            state: MDBStates.CAN_DOWNLOAD,
            downloaded: 0
        }

        this.handleDownloadClick = this.handleDownloadClick.bind(this);
    }

    simulateDownloading() {
        //Simulate downloading
        var inter = setInterval(() => {

            if (this.state.downloaded < 100) {

                this.setState((state) => ({
                    downloaded: state.downloaded + Math.round(Math.random() * 10)
                }));
            } else {
                this.setState({ state: MDBStates.CAN_WATCH });
                clearInterval(inter);
            }

        }, 500);
    }

    handleDownloadClick() {
        this.setState({ state: MDBStates.IS_DOWNLOADING });

        this.simulateDownloading();
    }

    render() {

        let { poster, title, rating, plot } = this.props;

        var card = (
            <div className="p-2">
                <Card className="media-card">
                    <Row className="no-gutters">
                        <div className={this.state.state === MDBStates.IS_DOWNLOADING ? "image downloading" : "image"} >
                            <Image className={this.props.loading ? 'skeleton' : ''} src={poster} alt={title} fluid />
                            <MediaDownloadButton
                                state={this.state.state}
                                onDownloadClick={this.handleDownloadClick}
                                percentsDownloaded={this.state.downloaded} />
                        </div>
                        <Col className="info p-2 pt-3">
                            {this.props.loading ?
                                <p className='skeleton title'>&nbsp;</p>
                                :
                                <p className={title?.length ?? 0 > 25 ? "small title" : "title"}>{title}</p>
                            }
                            <StarRating className="rating" stars={(rating ?? 0) * 0.5} />
                            {!this.props.loading && <p className="plot">{plot}</p>}
                        </Col>
                    </Row>
                </Card>
            </div>
        );

        if (this.props.uid) {
            return (
                <Link to={{ pathname: `/m/${this.props.uid}`, state: { background: this.props.location } }} style={{ color: "inherit" }}>
                    {card}
                </Link>
            )
        } else {
            return card;
        }
    }
}

export default withRouter(MediaCard);