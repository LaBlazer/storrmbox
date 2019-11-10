import React from 'react';
import Star from './Star';

class StarRating extends React.Component {
    render() {
        var stars = [];

        //Make half star more accurate (0.2-0.8) = half ?
        for (var i = 0; i < 5; i++) {
            if (i < this.props.stars) {
                stars.push(<Star key={i} half={(this.props.stars - i) < 1} active={true} />);
            } else {
                stars.push(<Star key={i} half={false} active={false} />);
            }
        }

        return <div>{stars}</div>;
    }
}

export default StarRating;