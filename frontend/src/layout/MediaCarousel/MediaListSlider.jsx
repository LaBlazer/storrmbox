import React from 'react';
import MediaContentLoader from '../../components/MediaContentLoader';
import { FixedSizeList as List } from 'react-window';

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
            lastWidth: -1
        }

        this.parentRef = React.createRef();
        this.updateSliderWidth = this.updateSliderWidth.bind(this);
    }

    updateSliderWidth() {
        if (this.parentRef.current && this.parentRef.current.clientWidth !== this.state.lastWidth) {
            this.setState((lastState) => ({ width: this.parentRef.current.clientWidth, lastWidth: lastState.width }));
        }
    }

    componentDidMount() {
        this.updateSliderWidth();
        window.addEventListener('resize', this.updateSliderWidth);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSliderWidth);
    }

    render() {
        const Row = ({ index, style }) => (
            <div style={style}>{<MediaContentLoader mediaId={this.props.uidList[index]} />}</div>
        );

        return (
            <div ref={this.parentRef}>
                <List
                    height={250}
                    itemCount={this.props.uidList.length}
                    itemSize={366}
                    layout="horizontal"
                    width={this.state.width}
                    overscanCount={2}
                >
                    {Row}
                </List>
            </div>
        )
    }
}

export default MediaListSlider;