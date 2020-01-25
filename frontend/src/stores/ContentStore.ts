import { observable } from 'mobx'
import { ContentModel, ContentType, ContentService } from '../endpoints/content';
import { Dictionary } from '../types/Dictionary';


class ContentStore {

    @observable
    popularList: Dictionary<string[] | null> = {}

    @observable
    topList: Dictionary<string[] | null> = {}

    @observable
    content: Dictionary<ContentModel | null> = {}

    @observable
    search: { runnig: boolean, results: string[] } = { runnig: false, results: [] }

    public getPopularList = async (type: ContentType) => {
        if (this.popularList[type] === undefined) {
            this.popularList[type] = null;
            let response = await ContentService.getPopularIDList(type);
            this.popularList[type] = response;
        }
    }

    public getTopList = async (type: ContentType) => {
        if (this.topList[type] === undefined) {
            this.topList[type] = null;
            let response = await ContentService.getTopIDList(type);
            this.topList[type] = response;
        }
    }

    public getContent = async (uid: string) => {
        if (this.content[uid] === undefined) {
            this.content[uid] = null;
            let response = await ContentService.getContentByID(uid);
            this.content[uid] = response;
        }
    }

    public runSearch = async (term: string) => {
        this.search.runnig = true;
        this.search.results = await ContentService.search(term);
        this.search.runnig = false;
    }
}

export default new ContentStore();


