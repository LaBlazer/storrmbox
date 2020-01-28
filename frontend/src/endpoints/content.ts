import AxiosI from "./api";
import { AxiosResponse } from "axios";

export type ContentTypeNames = "movie" | "series" | "episode";

export const ContenTypeMap = { 1: 'Movie', 2: 'Series', 3: 'Episode' }

export enum ContentType {
    MOVIE = 1,
    SERIES = 2,
    EPISODE = 3
};

export interface ContentModel {
    uid: string,
    type: 1 | 2 | 3,
    title: string
    year_released: number,
    year_end: number,
    runtime: number,
    rating: number,
    plot: string,
    genres: string,
    poster: string,
    trailer_youtube_id: string,
    episode: number,
    season: number
}

export interface Season {
    season: number,
    episodes: Episode[]
}

export interface Episode {
    episode: number,
    rating: number,
    title: string,
    uid: string
}

export class ContentService {

    static getPopularIDList(type: ContentTypeNames) {
        return this.getContentIDList("popular", type);
    }

    static getTopIDList(type: ContentTypeNames) {
        return this.getContentIDList("top", type);
    }

    static getContentByID(uid: string) {
        return AxiosI.get<any, AxiosResponse<ContentModel>>(`/content/${uid}`)
            .then(response => response.data);
    }

    static getSeasonsInfo(uid: string) {
        return AxiosI.get<any, AxiosResponse<{ seasons: Season[] }>>(`/content/${uid}/episodes`)
            .then(response => response.data.seasons);
    }

    static search(query: string) {
        return AxiosI.get<any, AxiosResponse<{ uids: string[] }>>('/content/search', { params: { query } })
            .then((response) => response.data.uids);
    }

    private static getContentIDList(type: string, filter: string) {
        if (type !== "popular" && type !== "top") throw new Error("[API] Unknown content type");

        return AxiosI.get<any, AxiosResponse<{ uids: string[] }>>(`/content/${type}`, { params: { type: filter } })
            .then((response) => response.data.uids);
    }
}