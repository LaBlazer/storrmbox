import React from 'react';
import { withRouter, Redirect, RouteComponentProps } from 'react-router-dom';
import ContentStore from '../stores/ContentStore';
import { observer } from 'mobx-react';
import { ContentType } from '../endpoints/content';
import { LoadingModal } from '../components/LoadingModal/LoadingModal';
import * as H from 'history';
import SeriesModal from '../components/MediaModals/SeriesModal';
import EpisodeModal from '../components/MediaModals/EpisodeModal';
import MovieModal from '../components/MediaModals/MovieModal';

type MULProps = RouteComponentProps<{ id: string }, any, { background?: H.Location<any>, play?: boolean }>;

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

    fetchContent() {
        let { id } = this.props.match.params;
        ContentStore.getContent(id);
    }

    componentDidUpdate(prevProps: MULProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.fetchContent();
        }
    }

    componentDidMount() {
        this.fetchContent();
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect push to={this.state.redirectTo} />
        }

        let play = this.props.location?.state?.play ?? false;
        let { id } = this.props.match.params;
        let content = ContentStore.content[id];
        if (content) {
            switch (content.type) {
                case ContentType.MOVIE:
                    return <MovieModal content={content} playContent={play} onHide={this.handleClose} />
                case ContentType.SERIES:
                    return <SeriesModal uid={id} content={content} playContent={play} onHide={this.handleClose} />
                case ContentType.EPISODE:
                    return <EpisodeModal parentUid={content.parent as string} playContent={play} content={content} onHide={this.handleClose} />
            }
        } else {
            return <LoadingModal />
        }
    }
}

export default withRouter(ModalUrlListener);
