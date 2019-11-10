import React from 'react';
import Star from './Star';

class StarRating extends React.Component {
    render() {
        var stars = [];

        for (var i = 0; i < 5; i++) {
            if (i < Math.ceil(this.props.stars)) {
                let rounded = Math.round((this.props.stars - i) * 2) / 2;
                stars.push(<Star key={i} half={rounded === 0.5} active={true} />);
            } else {
                stars.push(<Star key={i} half={false} active={false} />);
            }
        }

        return <span>{stars}</span>;
    }
}

export default StarRating;