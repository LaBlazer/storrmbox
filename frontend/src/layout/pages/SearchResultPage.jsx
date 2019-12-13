import React from 'react';
import { withRouter } from 'react-router-dom';
import API from '../../utils/API';
import MediaCardList from '../MediaCardList';
import FadeIn from 'react-fade-in/lib/FadeIn';

class SearchResultPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            uidList: []
        }
    }

    async fetchSearch(query) {
        try {
            this.setState({ loading: true });
            var data = await API.search(this.props.match.params.query);
            this.setState({ uidList: data });
        } catch (err) {
            console.error(err);
        } finally {
            this.setState({ loading: false });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.query != this.props.match.params.query) {
            this.fetchSearch(this.props.match.params.query);
        }
    }

    async componentDidMount() {
        this.fetchSearch(this.props.match.params.query);
    }

    render() {
        if (this.state.loading) {
            return <p className="pt-5 text-center">Searching...</p>;
        }

        return <>
            <h3 className="pt-5">Search results:</h3>
            <MediaCardList uidList={this.state.uidList} />
        </>
    }
}

export default withRouter(SearchResultPage);