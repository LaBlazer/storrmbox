import React from 'react';
import API from '../utils/API';
import MediaCardList from './MediaCardList';

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

            this.setState({ uidList: data });
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="pt-5">{this.props.title}</h3>
                <MediaCardList uidList={this.state.uidList} />
            </React.Fragment>
        )
    }
}

export default MediaPage;