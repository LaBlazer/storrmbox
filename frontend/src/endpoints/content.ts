import AxiosI from "./api";
import { AxiosResponse } from "axios";

export interface ContentModel {
    uid: string,
    type: number,
    title: string
    date_released: Date,
    date_end: Date,
    runtime: number,
    rating: number,
    plot: string,
    genres: string,
    poster: string,
    trailer_youtube_id: string,
    episode: number,
    seasos: number
}

export type ContentType = "movie" | "series" | "episode";

export class ContentService {

    static getPopularIDList(type: ContentType) {
        return this.getContentIDList("popular", type);
    }

    static getTopIDList(type: ContentType) {
        return this.getContentIDList("top", type);
    }

    static getContentByID(uid: string) {
        return AxiosI.get<any, AxiosResponse<ContentModel>>(`/content/${uid}`)
            .then(response => response.data);
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