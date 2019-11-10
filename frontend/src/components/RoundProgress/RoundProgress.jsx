import React from 'react';
import './RoundProgress.scss';

function percentageToDegrees(percentage) {
    return percentage / 100 * 360
}

class RoundProgress extends React.Component {

    render() {

        if (this.props.value >= 0 && this.props.value <= 100) {
            var right;
            var left;
            if (this.props.value <= 50) {
                right = {transform: `rotate(${percentageToDegrees(this.props.value)}deg)`};
                left = {};
            } else {
                right = {transform: `rotate(180deg)`};
                left = {transform: `rotate(${percentageToDegrees(this.props.value - 50)}deg)`};
            }
        } 
        
        var progressClasses = `progress-bar border-${this.props.variant || 'primary'}`;

        return (
            <div className="progress mx-auto">
                <span className="progress-left">
                    <span className={progressClasses} style={left}></span>
                </span>
                <span className="progress-right">
                    <span className={progressClasses} style={right}></span>
                </span>
                {/* <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                    <div className="font-weight-bold">{this.props.value}<sup className="small">%</sup></div>
                </div> */}
            </div>
        )

    }

}

export default RoundProgress;