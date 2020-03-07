import AxiosI from "./api";
import qs from "qs";
import { AxiosResponse } from "axios";

export interface UserModel {
    username: string,
    email: string,
    created: Date
}

export class UserService {

    static register(username: string, email: string, password: string, invite_code: string): Promise<UserModel> {
        return AxiosI.post<{ username: string, email: string, created: string }>(`/user`, qs.stringify({
            username, email, password, invite_code
        }))
            .then(response => ({
                username: response.data.username,
                email: response.data.email,
                created: new Date(response.data.created)
            }));
    }

    static getUser(): Promise<UserModel> {
        return AxiosI.get<{ username: string, email: string, created: string }>(`/user`)
            .then(response => ({
                username: response.data.username,
                email: response.data.email,
                created: new Date(response.data.created)
            }));
    }

    static invite() {
        return AxiosI.get<{ invite: string }>(`/user/invite`)
            .then(response => response.data);
    }

}