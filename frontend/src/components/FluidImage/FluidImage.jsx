import React from 'react';
import './FluidImage.scss';

class FluidImage extends React.Component {

    render() {
        return <div className={`sfluid-image ${this.props.className}`}>
            <img src={this.props.src} alt={this.props.alt} className="real" />
            <img src={this.props.src} alt={this.props.alt} className="background" />
        </div>
    }

}

export default FluidImage;