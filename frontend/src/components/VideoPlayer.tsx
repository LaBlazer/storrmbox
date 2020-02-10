import React, { Component } from 'react';
import Plyr from '@peergrade/react-plyr';
import "plyr/src/sass/plyr.scss";

export default class VideoPlayer extends Component<React.ComponentProps<typeof Plyr>> {

    child = React.createRef<Plyr>();

    //Workaround for volume disappearing
    onLoadedData = () => {
        this.child.current?.setCurrentTime(this.child.current?.getCurrentTime());
    }

    render() {
        let { provider, ...other } = this.props;
        return <Plyr
            ref={this.child}
            provider={provider ?? "html5"}
            onLoadedData={this.onLoadedData}
            {...other}
        />
    }
}