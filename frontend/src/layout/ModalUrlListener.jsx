import React from 'react';
import MediaModal from '../components/MediaModal/MediaModal';
import { withRouter, Redirect } from 'react-router-dom';
import API from '../utils/API';

class ModalUrlListener extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            media: null,
            loading: true,
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

    async componentDidMount() {
        let { id } = this.props.match.params;
        var data = await API.getContentByID(id);
        this.setState({ media: data, loading: false });
    }

    render() {

        if (this.state.forceClose) {
            return (
                <Redirect push to="/" />
            )
        }

        return (
            <MediaModal loading={this.state.loading} show={true} {...this.state.media} onHide={this.handleClose} />
        )
    }
}

export default withRouter(ModalUrlListener);
