import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import './StarRating.scss';

class StarRating extends React.Component {
    render() {
        var stars = [];

        for(var i = 0; i < 5; i++) {
            if(i < this.props.stars) {
                stars.push(<FontAwesomeIcon key={i} className="star" icon={faStar} />);
            } else {
                stars.push(<FontAwesomeIcon key={i} className="star star-black" icon={faStar} />);
            }
        }

        return stars;
    }
}

export default StarRating;