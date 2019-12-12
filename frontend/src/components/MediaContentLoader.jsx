import React from 'react';
import API from '../utils/API';
import MediaCard from './MediaCard/MediaCard';

class MediaContentLoader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data: {}
        }
    }

    async componentDidMount() {
        try {
            let result = await API.getContentByID(this.props.mediaId);
            this.setState({ data: result });

        } catch (err) {

        } finally {
            this.setState({ loading: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.loading !== nextState.loading) {
            return true;
        }

        console.log("Dont update me!");

        return false;
    }

    render() {
        return (
            <MediaCard loading={this.state.loading} {...this.state.data} />
        );
    }

}

export default MediaContentLoader;