import { observable } from "mobx";
import { ContentService } from "../endpoints/content";
import { Dictionary } from "../types/Dictionary";
import { TASK_FETCH_WAIT_TIME } from "configs/constants";

class DownloadStore {

    @observable
    downloads: Dictionary<{ type: string, data: string } | null | undefined> = {}

    public download = async (uid: string) => {
        if (this.downloads[uid] === undefined) {
            this.downloads[uid] = null;
            let tid = await ContentService.download(uid);
            this.fetch(uid, tid);
        }
    }

    private fetch = async (uid: string, taskID: string) => {
        try {
            if (this.downloads[uid] === undefined) this.downloads[uid] = null;

            let result = await ContentService.task(taskID);
            if (result.data !== null) {
                this.downloads[uid] = result;
            } else {
                setTimeout(() => this.fetch(uid, taskID), TASK_FETCH_WAIT_TIME);
            }
        } catch (err) {
            this.downloads[uid] = undefined;
        }
    }

}

export default new DownloadStore();
