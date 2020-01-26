import React from 'react';
import { ListGroup } from 'react-bootstrap';
import "./SeasonList.scss"

type SIProps = {
    season: number,
    active?: boolean,
    onClick?: (season: number) => void
}

export class SeasonItem extends React.Component<SIProps> {
    render() {
        return <ListGroup.Item
            className="item"
            action
            active={this.props.active}
            onClick={() => this.props.onClick?.(this.props.season)}
        >
            <span>#{this.props.season}</span>
        </ListGroup.Item>
    }
}