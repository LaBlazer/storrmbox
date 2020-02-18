import { ColoredNumberRating } from 'components/ColoredNumberRating/ColoredNumberRating';
import { ContentModel, ContenTypeMap } from 'endpoints/content';
import React from 'react';
import { Card, Col, Image, Row } from 'react-bootstrap';
import { MDBStates, MediaDownloadButton } from '../MediaDownloadButton/MediaDownloadButton';
import ModalLink from '../ModalLink';
import './MediaCard.scss';

type MediaCardProps = {
    loading?: boolean,
    content?: ContentModel
}

type MediaCardState = {
    state: MDBStates,
    downloaded: number
}

export default class MediaCard extends React.Component<MediaCardProps, MediaCardState> {

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

        let { uid, poster, title, rating, plot, type } = this.props.content ?? {};
        let typeName = (type) ? ContenTypeMap[type] : "";

        var card = (
            <div className="p-2">
                <Card className="media-card">
                    <Row className="no-gutters">
                        <div className={this.state.state === MDBStates.IS_DOWNLOADING ? "image downloading" : "image"} >
                            <Image className={this.props.loading ? 'skeleton' : ''} src={poster} alt={title} fluid />
                            <div className={`type-bar type-bar-${typeName}`}>&nbsp;</div>
                            <MediaDownloadButton
                                state={this.state.state}
                                onDownloadClick={this.handleDownloadClick}
                                percentsDownloaded={this.state.downloaded} />
                        </div>
                        <Col className="info p-2 pt-3">
                            {this.props.loading ?
                                <>
                                    <p className='skeleton title'>&nbsp;</p>
                                    <ColoredNumberRating className="rating skeleton" rating={-1} />
                                </>
                                :
                                <>
                                    <p className={title?.length ?? 0 > 25 ? "small title" : "title"}>{title}</p>
                                    <ColoredNumberRating className="rating" rating={(rating ?? 0) * 10} />
                                </>
                            }
                            {!this.props.loading && <p className="plot">{plot}</p>}
                        </Col>
                    </Row>
                </Card>
            </div>
        );

        if (uid) {
            return (
                <ModalLink to={`/m/${uid}`} style={{ color: "inherit" }}>
                    {card}
                </ModalLink>
            )
        } else {
            return card;
        }
    }
}