import React from "react";
import { Modal } from "react-bootstrap";
import "./LoadingModal.scss";
import { GrowLoader } from "../GrowLoader";

export class LoadingModal extends React.Component {
    render() {
        return <Modal
            show={true}
            size="lg"
            centered
            onHide={() => { }}
            className="loading-modal"
        >
            <GrowLoader size={4} />
        </Modal>
    }
}