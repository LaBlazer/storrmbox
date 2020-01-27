import { observable } from "mobx";
import { ContentService, Season } from "../endpoints/content";
import { Dictionary } from "../types/Dictionary";

class SeasonsStore {

    /**
     * Undefined - Data are not fetched
     * Null - Data are currently fetching
     * Not Null or undefined - Data are fetched
     *
     * @type {(Dictionary<Season[] | undefined | null>)}
     * @memberof SeasonsStore
     */
    @observable
    series: Dictionary<Season[] | undefined | null> = {};

    public getSeasons = async (uid: string) => {
        if (this.series[uid] === undefined) {
            try {
                this.series[uid] = null;
                let response = await ContentService.getSeasonsInfo(uid);
                for (let key in response) {
                    response[key].episodes = response[key].episodes.sort((a, b) => a.episode - b.episode);
                }
                this.series[uid] = response.sort((a, b) => a.season - b.season);
            } catch (err) {
                this.series[uid] = undefined;
            }
        }
    }

}

export default new SeasonsStore();
