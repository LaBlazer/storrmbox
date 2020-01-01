import React, { Component } from 'react';
import AnimatedList from './AnimatedList';
import Measure from 'react-measure';
import smoothscroll from 'smoothscroll-polyfill';



export class AutoSizingAnimatedList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listWidth: 500,
            itemWidth: 100
        }

        this.handleItemWidthUpdate = this.handleWidthUpdate.bind(this, "itemWidth");
        this.handleListWidthUpdate = this.handleWidthUpdate.bind(this, "listWidth");
    }

    handleWidthUpdate(item, contentRect) {
        const { width } = contentRect.bounds;

        if (this.state[item] !== width) {
            var obj = {};
            obj[item] = width;
            this.setState(obj);
        }
    }

    componentDidMount() {
        smoothscroll.polyfill();
    }

    _row = ({ index, style }) => {
        if (index == 0) {
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
                        >
                            {this._row}
                        </AnimatedList>
                    </div>
                )}
            </Measure>
        )
    }
}