import { observable } from 'mobx'
import { ContentModel, ContentTypeNames, ContentService } from '../endpoints/content';
import { Dictionary } from '../types/Dictionary';


class ContentStore {

    @observable
    popularList: Dictionary<string[] | undefined | null> = {}

    @observable
    topList: Dictionary<string[] | undefined | null> = {}

    @observable
    content: Dictionary<ContentModel | undefined | null> = {}

    public getPopularList = async (types: ContentTypeNames[]) => {
        types.forEach(async (type) => {
            if (this.popularList[type] === undefined) {
                try {
                    this.popularList[type] = null;
                    this.popularList[type] = await ContentService.getPopularIDList(type);
                }
                catch (err) {
                    this.popularList[type] = undefined;
                }
            }
        });
    }

    public getTopList = async (types: ContentTypeNames[]) => {
        types.forEach(async (type) => {
            if (this.topList[type] === undefined) {
                try {
                    this.topList[type] = null;
                    this.topList[type] = await ContentService.getTopIDList(type);
                } catch (err) {
                    this.topList[type] = undefined;
                }
            }
        });
    }

    public getContent = async (uid: string) => {
        if (this.content[uid] === undefined) {
            try {
                this.content[uid] = null;
                this.content[uid] = await ContentService.getContentByID(uid);
            } catch (err) {
                this.content[uid] = undefined;
            }
        }
    }

}

export default new ContentStore();


