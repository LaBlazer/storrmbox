import React from 'react';
import MediaModal from '../components/MediaModal/MediaModal';
import { withRouter, Redirect, RouteComponentProps } from 'react-router-dom';
import ContentStore from '../stores/ContentStore';
import { observer } from 'mobx-react';
import SeasonsStore from '../stores/SeasonsStore';
import { ContentType, ContentModel } from '../endpoints/content';

type MULProps = RouteComponentProps<{ id: string }, any, { background: string }>;


@observer
class ModalUrlListener extends React.Component<MULProps, { forceClose: boolean }> {

    constructor(props: MULProps) {
        super(props);

        this.state = {
            forceClose: false
        }

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        let { history } = this.props;
        if (history.length <= 2 || history.location.state?.background === undefined) {
            this.setState({ forceClose: true });
        } else {
            history.goBack();
        }
    }

    componentDidMount() {
        let { id } = this.props.match.params;
        ContentStore.getContent(id);

        let content = ContentStore.content[id];
        if(!content || (content && content.type === ContentType.SERIES)) {
            SeasonsStore.getSeasons(id);
        }
    }

    render() {
        if (this.state.forceClose) {
            return (
                <Redirect push to="/" />
            )
        }

        let { id } = this.props.match.params;
        if (ContentStore.content[id]) {
            return <MediaModal content={ContentStore.content[id] as ContentModel} seasons={SeasonsStore.series[id]} onHide={this.handleClose} />
        } else {
            return <div>Loadiding....</div>
        }
    }
}

export default withRouter(ModalUrlListener);
