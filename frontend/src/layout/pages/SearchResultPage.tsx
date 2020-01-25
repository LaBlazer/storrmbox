import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import MediaCardList from '../MediaCardList';
import ContentStore from '../../stores/ContentStore';
import { observer } from 'mobx-react';

type SRPProps = RouteComponentProps<{ query: string }>;

@observer
class SearchResultPage extends React.Component<SRPProps> {

    componentDidUpdate(prevProps: SRPProps) {
        if (prevProps.match.params.query !== this.props.match.params.query) {
            ContentStore.runSearch(this.props.match.params.query);
        }
    }

    componentDidMount() {
        ContentStore.runSearch(this.props.match.params.query);
    }

    render() {
        if (ContentStore.search.runnig) {
            return <p className="pt-5 text-center">Searching...</p>;
        }

        return <>
            <h3 className="pt-5">Search results:</h3>
            <MediaCardList uidList={ContentStore.search.results} />
        </>
    }
}

export default withRouter(SearchResultPage);