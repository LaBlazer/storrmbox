import React, { Component } from 'react';
import AnimatedList from './AnimatedList';
import Measure from 'react-measure';
import smoothscroll from 'smoothscroll-polyfill';


/**
 * Handles resizing list & items to elements CSS sizes
 *
 * @export
 * @class AutoSizingAnimatedList
 * @extends {Component}
 */
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
            scrollToItem: 0,
            forceScrolling: 0
        }

        this.handleItemWidthUpdate = this.handleItemWidthUpdate.bind(this);
        this.handleListWidthUpdate = this.handleListWidthUpdate.bind(this);
    }

    handleListWidthUpdate(contentRect) {
        const { width } = contentRect.bounds;

        if (this.state.listWidth !== width) {
            //If list shrinks, shrink items too
            let obj = {};
            if (width <= this.props.itemFillMaxWidth) {
                obj = { listWidth: width, itemWidth: width };
            } else {
                obj = { listWidth: width };
            }

            this.setState((prevState) => ({ ...obj, forceScrolling: prevState.forceScrolling + 1 }));
        }
    }

    handleItemWidthUpdate(contentRect) {
        const { width } = contentRect.bounds;

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
        if (this.props.scrollDirection !== prevProps.scrollDirection && this.props.scrollDirection !== 0) {
            const itemsPerScreen = Math.round(this.state.listWidth / this.state.itemWidth);

            let scrollTo = this.state.scrollToItem + itemsPerScreen * this.props.scrollDirection;
            if (scrollTo >= 0 && scrollTo <= this.props.itemCount - itemsPerScreen) {
                this.moveTo(scrollTo);
            } else {
                if (this.props.onAnimationComplete) this.props.onAnimationComplete();
            }
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
        const itemsPerScreen = Math.round(this.state.listWidth / this.state.itemWidth);

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
                            onAnimationComplete={this.animationComplete}
                            overscanCount={itemsPerScreen}
                            forceScrolling={this.state.forceScrolling}
                        >
                            {this._row}
                        </AnimatedList>
                    </div>
                )}
            </Measure>
        )
    }
}