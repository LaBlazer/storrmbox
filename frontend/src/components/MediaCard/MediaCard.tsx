import { ColoredNumberRating } from 'components/ColoredNumberRating/ColoredNumberRating';
import { MediaYear } from 'components/MediaYear';
import { ContentModel, ContenTypeMap } from 'endpoints/content';
import React from 'react';
import { Card, Image } from 'react-bootstrap';
import { contetTypeToClass } from 'utils/string-formater';
import { MDBStates } from '../MediaDownloadButton/MediaDownloadButton';
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

        let { uid, poster, title, rating, plot, type, year_released, year_end } = this.props.content ?? {};
        let typeName = (type) ? ContenTypeMap[type] : "";

        var card = (
            <Card className={"media-card " + (this.props.loading ? "loading" : "")}>

                <div className={`type-bar type-bar-${contetTypeToClass(typeName)}`}>&nbsp;</div>
                <Image className={this.props.loading ? 'skeleton' : ''} src={poster} alt={title} fluid />


                <div className="overlay">
                    <div className="plot hidden">{plot}
                    </div>
                </div>


                <div className="bottom-info">
                    <div className="info mb-2">
                        <ColoredNumberRating className="rating mr-2" rating={(rating ?? -1) * 10} />
                        <span className="year hidden">{!this.props.loading && <MediaYear type={type as 1 | 2 | 3} year_released={year_released as number} year_end={year_end} />}</span>
                    </div>
                    <p title={title} className={(title?.length ?? 0) > 25 ? "small title" : "title"}>{title ?? "..."}</p>
                </div>

            </Card>
        );

        if (uid) {
            return (
                <ModalLink to={`/m/${uid}`} className="mx-2 mt-1 mb-1 d-block" style={{ color: "inherit" }}>
                    {card}
                </ModalLink>
            )
        } else {
            return <div className="mx-2 mt-1 mb-1">{card}</div>;
        }
    }
}