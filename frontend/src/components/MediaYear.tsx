import React from 'react';
import { ContentType } from "../endpoints/content"
import { getYearsInterval } from "../utils/string-formater"

type MYProps = {
    type: number,
    year_released: number,
    year_end?: number
}

export class MediaYear extends React.Component<MYProps> {
    render() {
        if (this.props.type === ContentType.SERIES) {
            return getYearsInterval(this.props.year_released, this.props.year_end);
        } else {
            return this.props.year_released;
        }
    }
}