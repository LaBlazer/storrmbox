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
        firstLoad: 12,
        loadPerPage: 6
    }

    loadMore = (page: number) => {
        let { loadPerPage, uidList, firstLoad } = this.props;

        let loadTo = Math.min(firstLoad! + page * loadPerPage!, uidList.length);
        let slice = uidList.slice(0, loadTo);
        this.setState({ showing: slice });
    }

    render() {
        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMore}
                hasMore={this.state.showing.length < this.props.uidList.length}
            >
                <Row noGutters>
                    {
                        this.state.showing.map((mediaID, i) =>
                            <Col key={mediaID + ":" + i} className="transition text-center mb-3">
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