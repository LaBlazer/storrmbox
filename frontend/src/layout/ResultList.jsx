import React, { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import SearchResult from '../components/SearchResult/SearchResult';

class ResultList extends React.Component {
    render() {

        return (
            <Fragment>
                <h3>Vysledky hladania</h3>
                <Row>
                    {
                        this.props.data.map((value, index) => {
                            return <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                                <SearchResult data={value} />
                            </Col>
                        })
            }
                </Row >
            </Fragment>
        )
    }
}

export default ResultList;