import { observable } from "mobx";
import AxiosI from "../endpoints/api";
import { Dictionary } from "../types/Dictionary";

export type NotificationTypes = "info" | "success" | "warning" | "error" | "bug";

interface NotificationData {
    type: NotificationTypes,
    title: string,
    text: string,
}

interface Notification extends NotificationData {
    id: number,
    hideAfter: number,
    created: Date,
    remove: () => void
}

class NotificationStore {

    idCounter: number = 0;

    @observable
    notifications: Dictionary<Notification> = {};

    constructor() {

        //Add notifications on bad response
        AxiosI.interceptors.response.use(undefined, (error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                let { status } = error.response;
                if (status === 500) {
                    this.addNotification({ type: 'bug', title: '500: Server error', text: 'Server has encountered an internal error' }, 5*60000)
                } else if (status === 401) {
                    this.addNotification({ type: 'error', title: error.response.data, text: 'You are tring to sign-in with bad credentials' })
                } else {
                    this.addNotification({ type: 'error', title: "Error", text: `Server responded with: ${error.response.data}` })
                }
            } else if (error.request) {
                // The request was made but no response was received
                this.addNotification({ type: 'error', title: "Interniet ?!", text: 'Can\'t reach the server' })
            } else {
                this.addNotification({ type: 'error', title: "Error", text: 'Something very bad happend' })
                console.error('Error', error.message);
            }

            return Promise.reject(error);
        });

    }

    removeNotification(id: number) {
        if(this.notifications[id]) {
            delete this.notifications[id];
        }
    }

    addNotification(obj: NotificationData, hideAfter: number = 10000) {
        let id = this.idCounter++;
        let notification = { 
            id,
            remove: this.removeNotification.bind(this, id),
            created: new Date(), 
            hideAfter,
            ...obj 
        };
        this.notifications[id] = notification;
    }

}

export default new NotificationStore();
