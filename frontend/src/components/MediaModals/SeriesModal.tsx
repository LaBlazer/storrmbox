import React from 'react';
import SeasonsStore from '../../stores/SeasonsStore';
import { Row, Col } from 'react-bootstrap';
import { MediaModal } from './parts/MediaModal';
import { SeasonList } from '../SeasonList/SeasonList';
import { observer } from 'mobx-react';

type MMProps = React.ComponentProps<typeof MediaModal> & {
    uid: string
}

@observer
class SeriesModal extends React.Component<MMProps> {

    componentDidMount() {
        SeasonsStore.getSeasons(this.props.uid);
    }

    render() {
        let { uid, ...other } = this.props;
        
        let seasons = SeasonsStore.series[uid];

        return <MediaModal {...other}>
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