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
            isAnimating: false,
            scrollDirection: 0,
        }

        this.height = 250;
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
        <MediaContentLoader mediaId={this.props.uidList[index]} />
    )

    animationComplete = () => {
        this.setState({
            isAnimating: false,
            scrollDirection: 0
        });
    }

    render() {
        let listSize, empty;
        //Show loading media cards when list is empty
        if (this.props.uidList && this.props.uidList.length === 0) {
            listSize = 3;
            empty = true;
        } else {
            listSize = this.props.uidList.length;
            empty = false;
        }

        return (
            <>
                <div style={{ overflow: "hidden", height: this.height - 20 }}>
                    <AutoSizingAnimatedList
                        layout="horizontal"
                        duration={700}
                        easing={easeInOutQuint}
                        height={this.height}
                        onAnimationComplete={this.animationComplete}
                        itemCount={listSize}
                        overscanCount={2}
                        scrollDirection={this.state.scrollDirection}
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