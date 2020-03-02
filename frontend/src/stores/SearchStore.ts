import { observable } from "mobx";
import { ContentService } from "../endpoints/content";

class SearchStore {

    @observable
    fetching: boolean = false;

    @observable
    results: string[] = []

    public runSearch = async (term: string) => {
        try {
            this.fetching = true;
            this.results = await ContentService.search(term);
        } catch (err) {
            console.error(err);
            this.results = [];
        } finally {
            this.fetching = false;
        }
    }

}

export default new SearchStore();
