import React from 'react';
import SeasonsStore from '../../stores/SeasonsStore';
import { Row, Col } from 'react-bootstrap';
import { MediaModal } from './parts/MediaModal';
import { ContentModel } from '../../endpoints/content';
import { SeasonList } from '../SeasonList/SeasonList';
import { observer } from 'mobx-react';

type MMProps = {
    uid: string,
    content: ContentModel,
    onHide?: () => void
}

@observer
class SeriesModal extends React.Component<MMProps> {

    componentDidMount() {
        SeasonsStore.getSeasons(this.props.uid);
    }

    render() {
        let seasons = SeasonsStore.series[this.props.uid];

        return <MediaModal content={this.props.content} onHide={this.props.onHide}>
            <Row style={{ minHeight: "400px" }}>
                <Col lg={5}>
                    <p className="description">{this.props.content.plot}</p>
                </Col>
                <Col lg={7}>
                    <SeasonList seasons={seasons} />
                </Col>
            </Row>
        </MediaModal>
    }
}

export default SeriesModal;