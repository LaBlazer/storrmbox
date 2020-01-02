import React from 'react';
import MediaContentLoader from '../../components/MediaContentLoader';
import MediaCard from '../../components/MediaCard/MediaCard';
import { Button } from 'react-bootstrap';
import { AutoSizingAnimatedList } from './AutoSizingAnimatedList';

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
            loaded: 0,
            isAnimating: false,
            scrollSide: 0,
        }

        this.height = 250;
    }

    _scrollLeft = () => {
        if (!this.state.isAnimating) {
            this.setState((prevState) => {
                return {
                    isAnimating: true,
                    scrollSide: -1
                }
            });
        }
    }

    _scrollRight = () => {
        if (!this.state.isAnimating) {
            this.setState({
                isAnimating: true,
                scrollSide: 1
            });
        }
    }

    _emptyRow = ({ index, style }) => (
        <MediaCard show={true} loading={true} />
    )

    _row = ({ index, style }) => (
        <MediaContentLoader mediaId={this.props.uidList[index]} />
    )

    animationComplete = () => {
        this.setState({
            isAnimating: false,
            scrollSide: 0
        });
    }

    render() {
        //Show loading media cards when list is empty
        if (this.props.uidList && this.props.uidList.length == 0) {
            var listSize = 3;
            var empty = true;
        } else {
            var listSize = this.props.uidList.length;
            var empty = false;
        }

        return (
            <>
                <div style={{ overflow: "hidden", height: this.height - 20 }}>
                    <AutoSizingAnimatedList
                        layout="horizontal"
                        duration={1000}
                        easing={easeInOutQuint}
                        height={this.height}
                        onAnimationComplete={this.animationComplete}
                        itemCount={listSize}
                        overscanCount={2}
                        scrollSide={this.state.scrollSide}
                    >
                        {empty ? this._emptyRow : this._row}
                    </AutoSizingAnimatedList>
                </div>
                <div className="d-flex justify-content-between">
                    <Button onClick={this._scrollLeft} disabled={this.state.isAnimating} style={{
                        padding: "0 1em", fontSize: "1.4rem"
                    }}>&lt;</Button>
                    <Button onClick={this._scrollRight} disabled={this.state.isAnimating} style={{
                        padding: "0 1em", fontSize: "1.4rem"
                    }}>&gt;</Button>
                </div>
            </>
        )
    }
}

export default MediaListSlider;