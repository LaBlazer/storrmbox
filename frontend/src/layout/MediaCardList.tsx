import React from 'react';
import { Col, Row } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import MediaContentLoader from '../components/MediaContentLoader';

type MCLProps = {
    uidList: string[],
    firstLoad?: number,
    loadPerPage?: number
}

type MCLState = {
    showing: string[]
}

class MediaCardList extends React.Component<MCLProps, MCLState> {

    state = {
        showing: []
    }

    static defaultProps = {
        firstLoad: 5,
        loadPerPage: 6
    }

    loadMore = (page: number) => {

        let { loadPerPage, uidList, firstLoad } = this.props;

        let loadTo = Math.min(firstLoad! + page * loadPerPage!, uidList.length);
        let slice = uidList.slice(0, loadTo);
        console.log("Loading more... ", page, slice.length);
        this.setState({ showing: slice });
    }

    componentDidUpdate(prevProps: MCLProps) {
        let { uidList, firstLoad } = this.props;
        if (prevProps.uidList === uidList) return false;

        let loadTo = Math.min(firstLoad!, uidList.length);
        let slice = uidList.slice(0, loadTo);
        this.setState({ showing: slice });
    }

    render() {
        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMore}
                hasMore={this.state.showing.length < this.props.uidList.length}
                loader={<div className="loader" key={0}>Loading ...</div>}
            >
                <Row>
                    {
                        this.state.showing.map((mediaID, i) =>
                            <Col key={mediaID + ":" + i} xs={12} md={6} lg={4} className="mb-3">
                                <MediaContentLoader mediaID={mediaID} />
                            </Col>
                        )
                    }
                </Row >
            </InfiniteScroll>

        )
    }
}

export default MediaCardList;