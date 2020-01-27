import { observable } from "mobx";
import { ContentService } from "../endpoints/content";

class SearchStore {

    @observable
    fetching: boolean = false;

    @observable
    results: string[] = []

    public runSearch = async (term: string) => {
        this.fetching = true;
        this.results = await ContentService.search(term);
        this.fetching = false;
    }

}

export default new SearchStore();
