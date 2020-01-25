import React from 'react';
import MediaListSlider from '../components/MediaCarousel/MediaListSlider';
import ContentStore from '../stores/ContentStore';
import { observer } from 'mobx-react';
import { ContentType } from '../endpoints/content';

type MPProps = {
    category: ContentType,
    categoryName: string
}

@observer
class MediaPage extends React.Component<MPProps> {

    componentDidMount() {
        ContentStore.getPopularList(this.props.category);
        ContentStore.getTopList(this.props.category);
    }

    render() {
        return (
            <React.Fragment>
                <h3 className="pt-5">Top Rated {this.props.categoryName}</h3>
                <MediaListSlider uidList={ContentStore.topList[this.props.category]} />
                <h3 className="pt-4">Popular {this.props.categoryName}</h3>
                <MediaListSlider uidList={ContentStore.popularList[this.props.category]} />
            </React.Fragment>
        )
    }
}

export default MediaPage;