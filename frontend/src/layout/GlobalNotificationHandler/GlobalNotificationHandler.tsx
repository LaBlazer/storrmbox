import React from 'react';
import { Toast } from '../../components/Toast/Toast';
import { observer } from 'mobx-react';
import NotificationStore from '../../stores/NotificationStore';
import "./GlobalNotificationHandler.scss";

@observer
export class GlobalNotificationHandler extends React.Component {
    render() {
        return <div className="notifications">
            {/* <Toast text="An error has occured on backend!" title="Error handling" type="bug" />
            <Toast text="Zadali ste nespravne heslo" title="Error" type="error" />
            <Toast text="Jedno z nastaveni ste zle nastavili" title="Warning" type="warning" />
            <Toast text="Pozastavenie" title="Info" type="info" />
            <Toast text="Uspesne ste sa prihlasili" title="Success" type="success" /> */}

            {
                Object.keys(NotificationStore.notifications).map((key) => {
                    let notification = NotificationStore.notifications[key];
                    let { hideAfter, remove, ...other } = notification;
                    hideAfter = hideAfter - (Date.now() - notification.created.getTime());
                    if (hideAfter >= 0) {
                        return <Toast key={notification.id} hideAfter={hideAfter} onClose={notification.remove} {...other} />
                    }
                    return null;
                })
            }
        </div>
    }
}