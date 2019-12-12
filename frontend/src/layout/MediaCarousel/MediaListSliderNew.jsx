import React from 'react';
import MediaContentLoader from '../../components/MediaContentLoader';
import MediaCard from '../../components/MediaCard/MediaCard';
import { FixedSizeList as List } from 'react-window';

const FIRST_PRELOAD_COUNT = 20;
const LOAD_OFFSET = 5;
const NEW_LOAD_COUNT = 6;

class MediaListSliderNew extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            diraction: null,
            loaded: 0,
            items: [-1, -1, -1]
        }

    }

    // handleSelect(index, direction) {
    //     this.setState({ index, direction });

    //     // e.preventDefault();
    //     if (index + LOAD_OFFSET >= this.state.loaded) {
    //         this.setState(function (prevState, props) {
    //             let loadCount = prevState.loaded + NEW_LOAD_COUNT;
    //             let items = props.uidList.map((media, i) => (i < loadCount) ? media : -1);

    //             return {
    //                 loaded: loadCount, items: items
    //             };
    //         });
    //     }
    // }

    static getDerivedStateFromProps(props, state) {
        if (props.uidList && props.uidList.length > 0 && state.loaded == 0) {
            let items = props.uidList.map((media, i) => (i < FIRST_PRELOAD_COUNT) ? media : -1);
            return { items: items, loaded: FIRST_PRELOAD_COUNT };
        }

        return null;
    }

    render() {
        const Row = ({ index, style }) => (
            <div style={style}>{<MediaContentLoader mediaId={this.props.uidList[index]} />}</div>
        );

        return (
            <List
                height={250}
                itemCount={this.props.uidList.length}
                itemSize={366}
                layout="horizontal"
                width={1130}
                overscanCount={2}
            >
                {Row}
            </List>
        )
    }
}

export default MediaListSliderNew;