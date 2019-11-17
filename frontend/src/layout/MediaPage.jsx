import React from 'react';
import API from '../utils/API';
import MediaListSlider from './MediaCarousel/MediaListSlider';

class MediaPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            uidList: []
        }
    }

    async componentDidMount() {
        try {
            var data = await API.getPopularContent(this.props.category);

            // var half_length = Math.ceil(data.length / 2);

            // var leftSide = data.splice(0, half_length);
            var leftSide = data;

            this.setState({ uidList: leftSide });
            
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="pt-5">{this.props.title}</h3>
                <MediaListSlider uidList={this.state.uidList} />
            </React.Fragment>
        )
    }
}

export default MediaPage;