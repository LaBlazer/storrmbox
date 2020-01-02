import React from 'react';
import API from '../utils/API';
import MediaCard from './MediaCard/MediaCard';

class MediaContentLoader extends React.Component {

    constructor(props) {
        super(props);

        this._mounted = false;

        this.state = {
            loading: true,
            data: {}
        }
    }

    async componentDidMount() {
        try {
            this._mounted = true;
            let result = await API.getContentByID(this.props.mediaId);
            if (this._mounted) {
                this.setState({ data: result, loading: false });
            }
        } catch (err) {
            console.error("Error", err);
        } finally {
            if (this._mounted) {
                this.setState({ loading: false });
            }
        }
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.loading !== nextState.loading) {
            return true;
        }

        return false;
    }

    render() {
        return (
            <MediaCard loading={this.state.loading} {...this.state.data} />
        );
    }

}

export default MediaContentLoader;