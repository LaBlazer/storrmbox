import React, { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import MediaCard from '../components/MediaCard/MediaCard';

class MediaCardList extends React.Component {
    render() {

        return (
            <Fragment>
                <Row>
                    {
                        this.props.data.map((value, index) => {
                            return <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                                <MediaCard data={value} />
                            </Col>
                        })
                    }
                </Row >
            </Fragment>
        )
    }
}

export default MediaCardList;