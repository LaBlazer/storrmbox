import React from 'react';
import "./SeasonList.scss"
import { getEpisodeStringRepresentation } from 'utils/string-formater';
import ModalLink from '../ModalLink';

type EIProps = {
    season: number,
    episode: number,
    rating: number,
    title: string,
    uid: string,
    active?: boolean
}

export class EpisodeItem extends React.Component<EIProps> {
    render() {
        let { season, episode, title, active, uid } = this.props;

        return <div className="list-group-item">
            <ModalLink
                to={`/m/${uid}`}
                className={(active) ? "item active" : "item"}
                style={{ color: "inherit", textDecoration: "none" }}
            >
                <div className="mr-auto">
                    <small className="episode-number">{getEpisodeStringRepresentation(season, episode)}</small>
                    <div>{title}</div>
                </div>
                <span className="episode-number">#{episode}</span>
            </ModalLink>
        </div>
    }
}