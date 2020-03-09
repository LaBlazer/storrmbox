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
                
                //Disable global error handling (notification) for this request
                if (error.config.hasOwnProperty('errorHandle') && error.config.errorHandle === false) {
                    return Promise.reject(error);
                }
                
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                let { status } = error.response;
                if (status >= 500 && status <= 504) {
                    this.addNotification({ type: 'bug', title: 'Server error', text: 'Server has encountered an internal error' }, 5 * 60000);
                    console.log('Server error', error.response.data);
                } else if (status === 401) {
                    this.addNotification({ type: 'error', title: error.response.data, text: 'You are tring to sign-in with bad credentials or your session has expired' })
                } else {
                    this.addNotification({ type: 'error', title: "Error", text: `Server responded with: ${error.response.data}` });
                }
            } else if (error.request) {
                // The request was made but no response was received
                this.addNotification({ type: 'error', title: "No connection", text: 'Can\'t reach the backend server' });
            } else {
                this.addNotification({ type: 'error', title: "Error", text: 'Something very bad happend' });
                console.error('Error', error.message);
            }

            return Promise.reject(error);
        });

    }

    removeNotification(id: number) {
        if (this.notifications[id]) {
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
