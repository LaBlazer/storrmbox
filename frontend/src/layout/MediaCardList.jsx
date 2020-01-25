import React from 'react';
import { Col, Row } from 'react-bootstrap';
import MediaContentLoader from '../components/MediaContentLoader';

class MediaCardList extends React.Component {
    render() {
        return (
            <Row>
                {
                    this.props.uidList.map((media, i) => (i < 8) ?
                        (
                            <Col key={media + ":" + i} xs={12} md={6} lg={4} className="mb-3">
                                <MediaContentLoader mediaID={media} />
                            </Col>
                        ) : ''
                    )
                }
            </Row >
        )
    }
}

export default MediaCardList;