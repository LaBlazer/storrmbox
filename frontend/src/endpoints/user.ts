import qs from "qs";
import AxiosI from "./api";

export interface UserModel {
    username: string,
    email: string,
    created: Date,
    permission: number
}

export class UserService {

    static register(username: string, email: string, password: string, invite_code: string, errorHandle = true): Promise<UserModel> {
        return AxiosI.post<{ username: string, email: string, created: string, permission: number }>(`/user`, qs.stringify({
            username, email, password, invite_code
        }), { errorHandle })
            .then(response => ({
                username: response.data.username,
                email: response.data.email,
                created: new Date(response.data.created),
                permission: response.data.permission
            }));
    }

    static getUser(): Promise<UserModel> {
        return AxiosI.get<{ username: string, email: string, created: string, permission: number }>(`/user`)
            .then(response => ({
                username: response.data.username,
                email: response.data.email,
                created: new Date(response.data.created),
                permission: response.data.permission
            }));
    }

    static changePassword(current_password: string, new_password: string, errorHandle = true) {
        return AxiosI.post(`/user/password`, qs.stringify({ current_password, new_password }), { errorHandle });
    }

    static invite() {
        return AxiosI.get<{ invite: string }>(`/user/invite`)
            .then(response => response.data);
    }

}