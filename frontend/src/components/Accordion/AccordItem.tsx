import React from 'react';
import "./Accordion.scss";
import { ListGroup } from 'react-bootstrap';

type Item = {
    title: string,
    active?: boolean
}

type AIProps = {
    data: Item
}

export class AccordItem extends React.Component<AIProps> {

    render() {
        let { title, active } = this.props.data;

        return <ListGroup.Item active={active}>
            {title}
        </ListGroup.Item>
    }
}