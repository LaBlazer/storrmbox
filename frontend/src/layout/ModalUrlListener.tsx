import React from 'react';
import MediaModal from '../components/MediaModal/MediaModal';
import { withRouter, Redirect, RouteComponentProps } from 'react-router-dom';
import ContentStore from '../stores/ContentStore';
import { observer } from 'mobx-react';

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
    }

    render() {

        if (this.state.forceClose) {
            return (
                <Redirect push to="/" />
            )
        }

        let { id } = this.props.match.params;
        if (ContentStore.content[id]) {
            return <MediaModal show={true} {...ContentStore.content[id]} onHide={this.handleClose} />
        } else {
            return <MediaModal loading show={true} onHide={this.handleClose} />
        }
    }
}

export default withRouter(ModalUrlListener);
