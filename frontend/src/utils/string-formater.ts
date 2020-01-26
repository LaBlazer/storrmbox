export function getEpisodeStringRepresentation(season: number, episode: number) {
    let s = season.toString().padStart(2, '0');
    let e = episode.toString().padStart(2, '0');
    return `S${s}E${e}`;
}