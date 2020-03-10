import React from 'react';
import MediaListSlider from '../../components/MediaCarousel/MediaListSlider';
import ContentStore from '../../stores/ContentStore';
import { observer } from 'mobx-react';
import { ContentTypeNames } from '../../endpoints/content';

type MPProps = {
    category?: ContentTypeNames,
    categoryName: string
}

@observer
class MediaPage extends React.Component<MPProps> {

    componentDidMount() {
        if(this.props.category) {
            ContentStore.getPopularList([this.props.category]);
            ContentStore.getTopList([this.props.category]);
        } else {
            ContentStore.getPopularList(['movie', 'series']);
            ContentStore.getTopList(['movie', 'series']);
        }
    }

    private shuffle<T>(array1?: Array<T> | null, array2?: Array<T> | null) {
        const array = array1?.concat(array2 || []) || [];
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    render() {
        const top = this.props.category ? ContentStore.topList[this.props.category] :
            this.shuffle(ContentStore.topList['movie'], ContentStore.topList['series']);
        const popular = this.props.category ? ContentStore.popularList[this.props.category] :
            this.shuffle(ContentStore.popularList['movie'], ContentStore.popularList['series']);
        return (
            <div className="mb-4">
                <h3 className="pt-2">Top Rated {this.props.categoryName}</h3>
                <MediaListSlider uidList={top} />
                <h3 className="pt-4">Popular {this.props.categoryName}</h3>
                <MediaListSlider uidList={popular} />
            </div>
        )
    }
}

export default MediaPage;