import React from 'react';
import SeasonsStore from '../../stores/SeasonsStore';
import { Row, Col } from 'react-bootstrap';
import { MediaModal } from './parts/MediaModal';
import ContentStore from '../../stores/ContentStore';
import { ContentModel } from '../../endpoints/content';
import { SeasonList } from '../SeasonList/SeasonList';
import { observer } from 'mobx-react';

type MMProps = {
    uid: string,
    parentUid: string,
    content: ContentModel,
    onHide?: () => void
}

@observer
class EpisodeModal extends React.Component<MMProps> {

    componentDidMount() {
        ContentStore.getContent(this.props.parentUid);
        SeasonsStore.getSeasons(this.props.parentUid);
    }

    render() {
        let seasons = SeasonsStore.series[this.props.parentUid];

        let { season, episode, plot } = this.props.content;

        return <MediaModal content={this.props.content} onHide={this.props.onHide}>
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