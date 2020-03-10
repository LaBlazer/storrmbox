import AxiosI from "./api";
import { API_URL } from "configs/constants";

export type ContentTypeNames = "movie" | "series" | "episode";

export const ContenTypeMap = { 1: 'Movie', 2: 'TV Series', 3: 'Episode' }

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
    rating?: number,
    plot: string,
    genres?: string,
    poster: string,
    trailer_youtube_id: string,
    episode: number,
    season: number,
    parent?: string
}

export interface Season {
    season: number,
    episodes: Episode[]
}

export interface Episode {
    episode: number,
    rating?: number,
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
        return AxiosI.get<ContentModel>(`/content/${uid}`)
            .then(response => response.data);
    }

    static getSeasonsInfo(uid: string) {
        return AxiosI.get<{ seasons: Season[] }>(`/content/${uid}/episodes`)
            .then(response => response.data.seasons);
    }

    static search(query: string) {
        return AxiosI.get<{ uids: string[] }>('/content/search', { params: { query } })
            .then((response) => response.data.uids);
    }

    static task(taskID: string) {
        return AxiosI.get<{ type: string, data: string }>(`/task/${taskID}`)
            .then((response) => {
                if (response.data.data) {
                    return { type: response.data.type, data: `${API_URL}/${response.data.data}` };
                } else {
                    return response.data;
                }
            });
    }

    static download(uid: string) {
        return AxiosI.get<{ id: string }>(`/content/${uid}/download`)
            .then((response) => response.data.id);
    }

    static __reloadContent_UNSAFE() {
        return AxiosI.get('/content/reload');
    }

    private static getContentIDList(type: string, filter: string) {
        if (type !== "popular" && type !== "top") throw new Error("[API] Unknown content type");

        return AxiosI.get<{ uids: string[] }>(`/content/${type}`, { params: { type: filter } })
            .then((response) => response.data.uids);
    }
}