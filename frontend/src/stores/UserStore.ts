import { UserModel, UserService } from "endpoints/user";
import { observable } from "mobx";
import AuthStore from "./AuthStore";

class UserStore {

    @observable
    user: UserModel | null | undefined;

    public loadUser = async (forceLoad = false) => {
        if (!forceLoad && this.user !== undefined) return;

        try {
            this.user = null;
            this.user = await UserService.getUser();
        } catch (err) {
            console.error(err);

            this.user = undefined;
        }
    }

    public register = async (username: string, email: string, password: string, inviteCode: string) => {
        try {
            await UserService.register(username, email, password, inviteCode);
            AuthStore.login(username, password);
        } catch (err) {

        }
    }

}

export default new UserStore();
