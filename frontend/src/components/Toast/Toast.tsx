import React from 'react';
import { Toast as BToast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faExclamationTriangle, faInfoCircle, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { NotificationTypes } from '../../stores/NotificationStore';
import "./Toast.scss";

type TProps = {
    id: number,
    type: NotificationTypes,
    title: string,
    text: string,
    hideAfter: number,
    onClose: () => void
}

function getIcon(type: NotificationTypes) {
    switch (type) {
        case "success":
            return faCheckCircle;
        case "warning":
            return faExclamationTriangle;
        case "bug":
            return faBug;
        case "error":
            return faExclamationCircle;
        default:
            return faInfoCircle;
    }
}

export class Toast extends React.Component<TProps, { show: boolean }> {

    autohide: NodeJS.Timeout | null = null;

    state = {
        show: false
    }

    handleClose = () => {
        this.setState({ show: false }, () => {
            setTimeout(this.props.onClose, 2000);
        });
    }

    setupAutoClose = () => {
        if (this.autohide) {
            clearTimeout(this.autohide);
            this.autohide = null;
        }

        this.autohide = setTimeout(this.handleClose, this.props.hideAfter);
    }

    componentDidUpdate(prevProps: TProps) {
        if (prevProps.hideAfter !== this.props.hideAfter) {
            this.setupAutoClose();
        }
    }

    componentDidMount() {
        this.setState({ show: true });
        this.setupAutoClose();
    }

    componentWillUnmount() {
        if (this.autohide) {
            clearTimeout(this.autohide);
            this.autohide = null;
        }
    }

    render() {
        let { type, title, text } = this.props;

        return <BToast
            onClose={this.handleClose}
            show={this.state.show}
            className={type}>
            <BToast.Header>
                <span className="mr-2">
                    <FontAwesomeIcon icon={getIcon(type)} />
                </span>
                <strong className="mr-auto">{title}</strong>
                {/* <small>11 mins ago</small> */}
            </BToast.Header>
            <BToast.Body>{text}</BToast.Body>
        </BToast>
    }
}