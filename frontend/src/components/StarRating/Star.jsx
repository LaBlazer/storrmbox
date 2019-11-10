import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import './Stars.scss';

class Star extends React.Component {
    render() {

        var type = this.props.active === true ? "star" : "star star-black";

        if(this.props.active && this.props.half) {
            return (
                <span className="fa-layers fa-fw">
                    <FontAwesomeIcon className="star star-black" icon={faStar} />
                    <FontAwesomeIcon className="star" icon={faStarHalf} />
                </span>
            )
        } else {
            return <FontAwesomeIcon className={type} icon={faStar} />
        }
        
    }
}

export default Star;