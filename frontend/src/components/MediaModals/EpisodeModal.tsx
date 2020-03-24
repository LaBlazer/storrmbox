import ModalLink from 'components/ModalLink';
import { observer } from 'mobx-react';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getEpisodeStringRepresentation } from 'utils/string-formater';
import ContentStore from '../../stores/ContentStore';
import SeasonsStore from '../../stores/SeasonsStore';
import { SeasonList } from '../SeasonList/SeasonList';
import "./EpisodeModal.scss";
import { MediaModal } from './parts/MediaModal';

type MMProps = React.ComponentProps<typeof MediaModal> & {
    parentUid: string
}

@observer
class EpisodeModal extends React.Component<MMProps> {

    componentDidMount() {
        ContentStore.getContent(this.props.parentUid);
        SeasonsStore.getSeasons(this.props.parentUid);
    }

    render() {
        let { parentUid, ...other } = this.props;
        let seasons = SeasonsStore.series[this.props.parentUid];
        let seasonContent = ContentStore.content[this.props.parentUid];

        let { season, episode, plot, title } = this.props.content;

        return <MediaModal
            {...other}
            className="episode-modal"
            title={
                <div className="episode-top-info mb-sm-2">
                    <img src={seasonContent?.poster} className="poster mr-2" alt={`${seasonContent?.title} Poster`} />
                    <div>
                        <p className="series-name">
                            {
                                seasonContent?.title ?
                                    <ModalLink to={`/m/${parentUid}`}>
                                        {seasonContent.title}
                                    </ModalLink>
                                    :
                                    ''
                            }
                        </p>
                        <div className="episode">
                            <span className="number">{getEpisodeStringRepresentation(season, episode)} : </span>
                            <span className="title">{title}</span>
                        </div>
                    </div>
                </div>
            }
        >
            <Row style={{ minHeight: "400px" }}>
                <Col lg={5}>
                    <p className="description">{plot}</p>
                </Col>
                <Col lg={7}>
                    <SeasonList seasons={seasons} activeSeason={season} activeEpisode={episode} />
                </Col>
            </Row>
        </MediaModal>
    }
}

export default EpisodeModal;