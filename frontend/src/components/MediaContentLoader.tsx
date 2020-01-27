import React from 'react';
import MediaCard from './MediaCard/MediaCard';
import ContentStore from '../stores/ContentStore';
import { observer } from 'mobx-react';

type MCLProps = {
    mediaID: string
}

@observer
class MediaContentLoader extends React.Component<MCLProps> {

    componentDidMount() {
        if (this.props.mediaID) {
            ContentStore.getContent(this.props.mediaID);
        }
    }

    render() {
        let content = ContentStore.content[this.props.mediaID];

        if (content) {
            return <MediaCard {...content} />;
        } else {
            return <MediaCard loading={true} />;
        }
    }
}

export default MediaContentLoader;