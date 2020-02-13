import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { MediaModal } from './parts/MediaModal';
import { observer } from 'mobx-react';

type MMProps = React.ComponentProps<typeof MediaModal> & {
}

@observer
class MovieModal extends React.Component<MMProps> {
    render() {
        return <MediaModal {...this.props}>
            <Row style={{ minHeight: "400px" }}>
                <Col lg={12}>
                    <p className="description">{this.props.content.plot}</p>
                </Col>
            </Row>
        </MediaModal>
    }
}

export default MovieModal;