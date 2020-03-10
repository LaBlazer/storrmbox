import React, { Component } from "react";
import "./ColoredNumberRating.scss";


type NRProps = {
    /**
     * Rating 0-100
     *
     * @type {number}
     */
    rating: number,
    className?: string
}

const CATEGORIES = 4;

export class ColoredNumberRating extends Component<NRProps> {

    categorizeNumber(number: number) {
        number /= 100;
        return Math.floor(number * CATEGORIES) / CATEGORIES * 100;
    }

    render() {
        if (this.props.rating >= 0) {
            let number = Math.min(100, Math.round(this.props.rating));
            let category = this.categorizeNumber(number);
            return <span className={`number-rating rating-category-${category} ${this.props.className}`}>{number}</span>;
        } else {
            return <span className={`number-rating ${this.props.className}`}>&nbsp;-&nbsp;</span>;
        }
    }
}