import React from "react";
import { Spinner } from "react-bootstrap";

type LMProps = {
    size: number
}

export class GrowLoader extends React.Component<LMProps> {
    render() {
        return <Spinner style={{ width: `${this.props.size}rem`, height: `${this.props.size}rem` }} animation="grow" variant="primary" />
    }
}