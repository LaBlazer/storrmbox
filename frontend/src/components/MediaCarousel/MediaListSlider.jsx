import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import MediaCard from '../../components/MediaCard/MediaCard';
import MediaContentLoader from '../../components/MediaContentLoader';
import { AutoSizingAnimatedList } from './AutoSizingAnimatedList';
import "./MediaListSlider.scss";

function easeInOutQuint(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Media slider, that dynamicly adjusts it's width and 
 * loads only MediaCards that are visible
 */
class MediaListSlider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isAnimating: false,
            scrollDirection: 0,
            canMoveLeft: false,
            canMoveRight: true
        }

        this.height = 310;
    }

    _scrollLeft = () => {
        if (!this.state.isAnimating) {
            this.setState({
                isAnimating: true,
                scrollDirection: -1
            });
        }
    }

    _scrollRight = () => {
        if (!this.state.isAnimating) {
            this.setState({
                isAnimating: true,
                scrollDirection: 1
            });
        }
    }

    _emptyRow = ({ index, style }) => (
        <MediaCard show={true} loading={true} />
    )

    _row = ({ index, style }) => (
        <MediaContentLoader mediaID={this.props.uidList[index]} />
    )

    animationComplete = (currentItem, canMoveLeft, canMoveRight) => {
        this.setState({
            isAnimating: false,
            scrollDirection: 0,
            canMoveLeft,
            canMoveRight
        });
    }

    render() {
        let listSize = 7, empty = true;
        if (this.props.uidList && this.props.uidList.length !== 0) {
            listSize = this.props.uidList.length;
            empty = false;
        }

        return (
            <div className="media-card-slider">
                <div className="slider" style={{ height: this.height - 30 }}>
                    <AutoSizingAnimatedList
                        layout="horizontal"
                        duration={700}
                        easing={easeInOutQuint}
                        height={this.height}
                        onAnimationComplete={this.animationComplete}
                        itemCount={listSize}
                        scrollDirection={this.state.scrollDirection}
                    >
                        {empty ? this._emptyRow : this._row}
                    </AutoSizingAnimatedList>
                </div>

                <button className={`slider-button left ${this.state.canMoveLeft ? '' : 'hide'}`}
                    onClick={this._scrollLeft}
                    disabled={this.state.isAnimating}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <button className={`slider-button right ${this.state.canMoveRight ? '' : 'hide'}`}
                    onClick={this._scrollRight}
                    disabled={this.state.isAnimating}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>

            </div>
        )
    }
}

export default MediaListSlider;