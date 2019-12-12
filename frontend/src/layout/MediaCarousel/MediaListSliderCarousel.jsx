import React from 'react';
import MediaContentLoader from '../../components/MediaContentLoader';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import MediaCard from '../../components/MediaCard/MediaCard';

const FIRST_PRELOAD_COUNT = 5;
const LOAD_OFFSET = 5;
const NEW_LOAD_COUNT = 6;

/**
 * Old carousel using slick carousel
 * @deprecated
 */
class MediaListSliderCarousel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loaded: 0,
            items: [-1, -1, -1]
        }

        this.onMove = this.onMove.bind(this);
    }

    onMove(oldIndex, newIndex) {
        if (newIndex + LOAD_OFFSET >= this.state.loaded) {
            this.setState(function (prevState, props) {
                let loadCount = prevState.loaded + NEW_LOAD_COUNT;
                let items = props.uidList.map((media, i) => (i < loadCount) ? media : -1);

                return {
                    loaded: loadCount, items: items
                };
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.uidList != nextProps.uidList) {
            return true;
        }

        if(this.state.loaded !== nextState.loaded) {
            return true;
        }
        
        console.log("Dont need to update");
        
        return false;
    }

    static getDerivedStateFromProps(props, state) {
        if (props.uidList && props.uidList.length > 0 && state.loaded == 0) {
            let items = props.uidList.map((media, i) => (i < FIRST_PRELOAD_COUNT) ? media : -1);
            return { items: items, loaded: FIRST_PRELOAD_COUNT };
        }

        return null;
    }

    render() {
        var settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 2,
            draggable: false,
            beforeChange: this.onMove,
            lazyLoad: true,
            swipeToSlide: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        };

        return (
            <Slider {...settings}>
                {
                    this.state.items.map((media, i) =>
                        (
                            <React.Fragment key={this.props.uidList[i] || i}>
                                {(media === -1) ?
                                    <MediaCard loading={true} />
                                    : <MediaContentLoader mediaId={this.state.items[i]} />
                                }
                            </React.Fragment>
                        ))
                }
            </Slider>
        )
    }
}

export default MediaListSliderCarousel;