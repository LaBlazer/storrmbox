import React from 'react';
import { ListGroup } from 'react-bootstrap';

type AProps = {
    className?: string,
    itemCount?: number,
    items: object[],
    itemComponent: React.ComponentClass<any>,
    onItemClick?: (...args: any) => void
}

export class Accordion extends React.Component<AProps> {

    render() {
        let useItems = this.props.items && this.props.items.length !== 0;
        let items = [];
        if (useItems) {
            items = this.props.items;
        } else {
            //Create array of empty objects
            items = new Array(this.props.itemCount ?? 3).fill(0).map(_ => ({}));
        }

        let Component = this.props.itemComponent;
        return <ListGroup className={`accordion ${this.props.className}`}>
            {
                items.map((item, index) => <Component key={index} onClick={this.props.onItemClick} {...item} />)
            }
        </ListGroup>
    }
}