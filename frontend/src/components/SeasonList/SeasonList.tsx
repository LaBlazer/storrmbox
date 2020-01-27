import React from 'react';
import { Accordion } from '../Accordion/Accordion';
import { SeasonItem } from './SeasonItem';
import { Season } from '../../endpoints/content';
import { EpisodeItem } from './EpisodeItem';
import "./SeasonList.scss"

type SLProps = {
    seasons?: Season[] | null
}

type SLState = {
    pickedSeason: number
}

export class SeasonList extends React.Component<SLProps, SLState> {

    state = {
        pickedSeason: 1
    }

    onSeasonClicked = (season: number) => {
        this.setState({ pickedSeason: season });
    }

    render() {
        if (this.props.seasons) {

            if (this.props.seasons?.length === 0) {
                return <span>No seasons are out yet!</span>
            }

            let seasons = this.props.seasons.map((item) => ({ active: (item.season === this.state.pickedSeason), season: item.season }));
            let pickedSeason = this.props.seasons[this.state.pickedSeason - 1];
            let episodes = pickedSeason.episodes.map((item) => ({ season: pickedSeason.season, ...item }));
            
            return <div className="bg">
                <Accordion className="season-list" items={seasons} onItemClick={this.onSeasonClicked} itemComponent={SeasonItem} />
                <Accordion className="episode-list" items={episodes} itemComponent={EpisodeItem} />
            </div>
        }

        return <span>Loading...</span>;
    }
}