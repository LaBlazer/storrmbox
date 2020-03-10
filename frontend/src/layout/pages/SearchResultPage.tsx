import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import MediaCardList from '../MediaCardList';
import { observer } from 'mobx-react';
import SearchStore from '../../stores/SearchStore';

type SRPProps = RouteComponentProps<{ query: string }>;

@observer
class SearchResultPage extends React.Component<SRPProps> {

    componentDidUpdate(prevProps: SRPProps) {
        if (prevProps.match.params.query !== this.props.match.params.query) {
            SearchStore.runSearch(this.props.match.params.query);
        }
    }

    componentDidMount() {
        SearchStore.runSearch(this.props.match.params.query);
    }

    render() {
        if (SearchStore.fetching) {
            return <p className="pt-3 text-center">Searching...</p>;
        }

        if (!SearchStore.results.length) {
            return <p className="pt-3 text-center">No results</p>; 
        }
        
        return <>
            <h3 className="pt-3">Search results:</h3>
            <MediaCardList uidList={SearchStore.results} />
        </>
    }
}

export default withRouter(SearchResultPage);