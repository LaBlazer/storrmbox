import React from 'react';
import { Accordion } from '../Accordion/Accordion';
import { SeasonItem } from './SeasonItem';
import { Season } from '../../endpoints/content';
import { EpisodeItem } from './EpisodeItem';
import "./SeasonList.scss"

type SLProps = {
    seasons?: Season[] | null,
    activeSeason?: number,
    activeEpisode?: number,
    onEpisodeClick?: (episode: string) => void
}

type SLState = {
    pickedSeason: number
}

export class SeasonList extends React.Component<SLProps, SLState> {

    state = {
        pickedSeason: this.props.activeSeason ?? 1
    }

    onSeasonClicked = (season: number) => {
        this.setState({ pickedSeason: season });
    }

    render() {
        if (this.props.seasons) {

            if (this.props.seasons?.length === 0) {
                return <span>No seasons are out yet!</span>
            }

            let seasons = this.props.seasons.map((item) => ({ season: item.season, active: (item.season === this.state.pickedSeason) }));
            let pickedSeason = this.props.seasons[this.state.pickedSeason - 1];
            let episodes = pickedSeason.episodes.map((item) => (
                {
                    season: pickedSeason.season,
                    ...item,
                    active: (this.props.activeSeason === this.state.pickedSeason && this.props.activeEpisode === item.episode)
                }
            ));

            return <div className="bg series-list">
                <Accordion className="season-list" items={seasons} onItemClick={this.onSeasonClicked} itemComponent={SeasonItem} />
                <Accordion className="episode-list" items={episodes} itemComponent={EpisodeItem} />
            </div>
        }

        return <span>Loading...</span>;
    }
}