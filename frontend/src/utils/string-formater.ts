export function getEpisodeStringRepresentation(season: number, episode: number) {
    let s = season.toString().padStart(2, '0');
    let e = episode.toString().padStart(2, '0');
    return `S${s}E${e}`;
}

export function getYearsInterval(releaseYear: number, endYear: number | undefined) {
    let year = `${releaseYear} –\u00A0`;

    return (endYear) ? `${year}${endYear}` : year;
}