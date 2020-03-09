import { UserModel, UserService } from "endpoints/user";
import { observable } from "mobx";

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

}

export default new UserStore();
