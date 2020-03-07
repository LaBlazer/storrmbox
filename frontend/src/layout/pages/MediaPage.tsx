import React from 'react';
import MediaListSlider from '../../components/MediaCarousel/MediaListSlider';
import ContentStore from '../../stores/ContentStore';
import { observer } from 'mobx-react';
import { ContentTypeNames } from '../../endpoints/content';

type MPProps = {
    category: ContentTypeNames,
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
            <div className="mb-4">
                <h3 className="pt-2">Top Rated {this.props.categoryName}</h3>
                <MediaListSlider uidList={ContentStore.topList[this.props.category]} />
                <h3 className="pt-4">Popular {this.props.categoryName}</h3>
                <MediaListSlider uidList={ContentStore.popularList[this.props.category]} />
            </div>
        )
    }
}

export default MediaPage;