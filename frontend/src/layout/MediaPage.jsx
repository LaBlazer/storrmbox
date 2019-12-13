import React from 'react';
import API from '../utils/API';
import MediaListSlider from './MediaCarousel/MediaListSlider';

class MediaPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            popularUidList: [],
            topUidList: []
        }
    }

    async componentDidMount() {

        API.getPopularIDList(this.props.category).then((data) => {
            this.setState({ popularUidList: data });
        }).catch(err => console.error(err));

        API.getTopIDList(this.props.category).then((data) => {
            this.setState({ topUidList: data });
        }).catch(err => console.error(err));

    }

    render() {
        return (
            <React.Fragment>
                <h3 className="pt-5">Top Rated {this.props.title}</h3>
                <MediaListSlider uidList={this.state.topUidList} />
                <h3 className="pt-4">Popular {this.props.title}</h3>
                <MediaListSlider uidList={this.state.popularUidList} />
            </React.Fragment>
        )
    }
}

export default MediaPage;