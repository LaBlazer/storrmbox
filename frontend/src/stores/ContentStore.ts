import { observable } from 'mobx'
import { ContentModel, ContentType, ContentService } from '../endpoints/content';
import { Dictionary } from '../types/Dictionary';


class ContentStore {

    @observable
    popularList: Dictionary<string[] | undefined | null> = {}

    @observable
    topList: Dictionary<string[] | undefined | null> = {}

    @observable
    content: Dictionary<ContentModel | undefined | null> = {}

    public getPopularList = async (type: ContentType) => {
        if (this.popularList[type] === undefined) {
            try {
                this.popularList[type] = null;
                let response = await ContentService.getPopularIDList(type);
                this.popularList[type] = response;
            } catch (err) {
                this.popularList[type] = undefined;
                this.topList[type] = undefined;
            }
        }
    }

    public getTopList = async (type: ContentType) => {
        if (this.topList[type] === undefined) {
            try {
                this.topList[type] = null;
                let response = await ContentService.getTopIDList(type);
                this.topList[type] = response;
            } catch (err) {
                this.topList[type] = undefined;
            }
        }
    }

    public getContent = async (uid: string) => {
        if (this.content[uid] === undefined) {
            try {
                this.content[uid] = null;
                let response = await ContentService.getContentByID(uid);
                this.content[uid] = response;
            } catch (err) {
                this.content[uid] = undefined;
            }
        }
    }

}

export default new ContentStore();


