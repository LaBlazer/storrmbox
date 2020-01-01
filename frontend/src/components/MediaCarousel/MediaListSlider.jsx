import React from 'react';
import MediaContentLoader from '../../components/MediaContentLoader';
import MediaCard from '../../components/MediaCard/MediaCard';
import smoothscroll from 'smoothscroll-polyfill';
import { Button } from 'react-bootstrap';
import AnimatedList from './AnimatedList';

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
            width: 0,
            lastWidth: -1,
            isAnimating: false,
            scrollToItem: 0
        }

        this.height = 250;

        this.parentRef = React.createRef();
        this.updateSliderWidth = this.updateSliderWidth.bind(this);
    }

    updateSliderWidth() {
        if (this.parentRef.current && this.parentRef.current.clientWidth !== this.state.lastWidth) {
            this.setState((lastState) => ({ width: this.parentRef.current.clientWidth, lastWidth: lastState.width }));
        }
    }

    componentDidMount() {
        smoothscroll.polyfill();

        this.updateSliderWidth();
        window.addEventListener('resize', this.updateSliderWidth);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSliderWidth);
    }

    _scrollLeft = () => {
        if (!this.state.isAnimating) {
            this.setState((prevState) => {
                var scrollToItem = Math.max(0, (prevState.scrollToItem || 0) - 3);
                return {
                    isAnimating: true,
                    scrollToItem
                }
            });
        }
    }

    _scrollRight = () => {
        if (!this.state.isAnimating) {
            var length = (this.props.uidList && this.props.uidList.length == 0) ? 3 : this.props.uidList.length;

            this.setState((prevState) => {
                var scrollToItem = Math.min((prevState.scrollToItem || 0) + 3, length);
                return {
                    isAnimating: true,
                    scrollToItem
                }
            });
        }
    }

    _loadingRow = ({ index, style }) => (
        <div style={style}>{<MediaCard show={true} loading={true} />}</div>
    )

    _row = ({ index, style }) => (
        <div style={style}>{<MediaContentLoader mediaId={this.props.uidList[index]} />}</div>
    )

    animationComplete = () => {
        this.setState({
            isAnimating: false,
        });
    }

    render() {
        //Show loading media cards when list is empty
        if (this.props.uidList && this.props.uidList.length == 0) {
            var listSize = 3;
            var loading = true;
        } else {
            var listSize = this.props.uidList.length;
            var loading = false;
        }

        return (
            <>
                <div ref={this.parentRef} style={{ overflow: "hidden", height: this.height - 20 }}>
                    <AnimatedList
                        layout="horizontal"
                        duration={800}
                        easing={easeInOutQuint}
                        width={this.state.width}
                        height={this.height}
                        onAnimationComplete={this.animationComplete}
                        itemCount={listSize}
                        itemSize={366}
                        overscanCount={2}
                        scrollToItem={this.state.scrollToItem}
                    >
                        {loading ? this._loadingRow : this._row}
                    </AnimatedList>
                </div>
                <div className="d-flex justify-content-between">
                    <Button onClick={this._scrollLeft} disabled={this.state.isAnimating}>&lt;</Button>
                    <Button onClick={this._scrollRight} disabled={this.state.isAnimating}>&gt;</Button>
                </div>
            </>
        )
    }
}

export default MediaListSlider;