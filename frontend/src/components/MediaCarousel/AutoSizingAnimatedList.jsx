import React, { Component } from 'react';
import AnimatedList from './AnimatedList';
import Measure from 'react-measure';
import smoothscroll from 'smoothscroll-polyfill';



export class AutoSizingAnimatedList extends Component {

    static defaultProps = {
        itemFillMaxWidth: 545
    }

    constructor(props) {
        super(props);

        this.state = {
            animating: false,
            listWidth: 500,
            itemWidth: 100,
            scrollToItem: 0
        }

        this.handleItemWidthUpdate = this.handleItemWidthUpdate.bind(this);
        this.handleListWidthUpdate = this.handleListWidthUpdate.bind(this);
    }

    handleListWidthUpdate(contentRect) {
        const { width } = contentRect.bounds;
        console.log("List", width, this.state);

        if (this.state.listWidth !== width) {
            //If list shrinks, shrink items too
            if (width <= this.props.itemFillMaxWidth) {
                this.setState({ listWidth: width, itemWidth: width });
            } else {
                this.setState({ listWidth: width });
            }
        }
    }

    handleItemWidthUpdate(contentRect) {
        const { width } = contentRect.bounds;
        console.log("Item", width, this.state);

        if (this.state.itemWidth !== width) {
            //If list is samller than itemFillMaxWidth, then resize Items to list width
            //This happens on content loading
            if (width <= this.state.listWidth && this.state.listWidth <= this.props.itemFillMaxWidth) {
                this.setState({ itemWidth: this.state.listWidth });
            } else {
                this.setState({ itemWidth: width });
            }
        }
    }

    componentDidMount() {
        smoothscroll.polyfill();
        this.listChangeCount = 0;
    }

    moveTo(index) {
        this.setState((prev) => {
            if (!prev.animating) {
                return {
                    scrollToItem: index,
                    animating: true
                }
            }

            return {};
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.scrollSide !== prevProps.scrollSide && this.props.scrollSide !== 0) {
            const itemsPerScreen = Math.round(this.state.listWidth / this.state.itemWidth);

            this.moveTo(this.state.scrollToItem + itemsPerScreen * this.props.scrollSide);
        }
    }

    animationComplete = () => {
        this.setState({
            animating: false
        }, this.props.onAnimationComplete);
    }


    _row = ({ index, style }) => {
        if (index === this.state.scrollToItem) {
            return (
                <Measure
                    bounds
                    onResize={this.handleItemWidthUpdate}
                >
                    {({ measureRef }) => (
                        <div style={style}>
                            <div ref={measureRef} style={{ display: "inline-block" }}>
                                {this.props.children({ index, style })}
                            </div>
                        </div>
                    )}
                </Measure>
            )
        } else {
            return <div style={style}>
                {this.props.children({ index, style })}
            </div>
        }
    }

    render() {
        return (
            <Measure
                bounds
                onResize={this.handleListWidthUpdate}
            >
                {({ measureRef }) => (
                    <div ref={measureRef}>
                        <AnimatedList
                            {...this.props}
                            width={this.state.listWidth}
                            itemSize={this.state.itemWidth}
                            scrollToItem={this.state.scrollToItem}
                            forceScrolling={this.state.forceScroll}
                            onAnimationComplete={this.animationComplete}
                        >
                            {this._row}
                        </AnimatedList>
                    </div>
                )}
            </Measure>
        )
    }
}