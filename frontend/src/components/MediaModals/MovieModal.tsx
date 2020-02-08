import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { MediaModal } from './parts/MediaModal';
import { ContentModel } from '../../endpoints/content';
import { observer } from 'mobx-react';

type MMProps = {
    uid: string,
    content: ContentModel,
    onHide?: () => void
}

@observer
class MovieModal extends React.Component<MMProps> {
    render() {
        return <MediaModal content={this.props.content} onHide={this.props.onHide}>
            <Row style={{ minHeight: "400px" }}>
                <Col lg={12}>
                    <p className="description">{this.props.content.plot}</p>
                </Col>
            </Row>
        </MediaModal>
    }
}

export default MovieModal;