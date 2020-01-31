import React from 'react';
import MediaModal from '../components/MediaModal/MediaModal';
import { withRouter, Redirect, RouteComponentProps } from 'react-router-dom';
import ContentStore from '../stores/ContentStore';
import { observer } from 'mobx-react';
import SeasonsStore from '../stores/SeasonsStore';
import { ContentType } from '../endpoints/content';
import { LoadingModal } from '../components/LoadingModal/LoadingModal';
import * as H from 'history';


type MULProps = RouteComponentProps<{ id: string }, any, { background?: H.Location<any> }>;

@observer
class ModalUrlListener extends React.Component<MULProps, { redirectTo: string | null }> {

    constructor(props: MULProps) {
        super(props);

        this.state = {
            redirectTo: null
        }

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        let { history, location } = this.props;
        if (location.state?.background) {
            this.setState({ redirectTo: location.state.background.pathname });
        } else if (history.length <= 2 || history.location.state?.background === undefined) {
            this.setState({ redirectTo: "/" });
        } else {
            history.goBack();
        }
    }

    componentDidMount() {
        let { id } = this.props.match.params;
        ContentStore.getContent(id);

        let content = ContentStore.content[id];
        if (!content || (content && content.type === ContentType.SERIES)) {
            SeasonsStore.getSeasons(id);
        }
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect push to={this.state.redirectTo} />
        }

        let { id } = this.props.match.params;
        let content = ContentStore.content[id];
        if (content) {
            return <MediaModal content={content} seasons={SeasonsStore.series[id]} onHide={this.handleClose} />
        } else {
            return <LoadingModal />
        }
    }
}

export default withRouter(ModalUrlListener);
