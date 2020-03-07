import AxiosI from "./api";
import { AxiosResponse } from "axios";

export interface UserModel {
    username: string,
    email: string,
    created: Date
}

export class UserService {

    static register(username: string, email: string, password: string, invite_code: string): Promise<UserModel> {
        return AxiosI.post<{ username: string, email: string, created: string }>(`/user`, {
            params: { username, email, password, invite_code }
        })
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
        return AxiosI.get<any, AxiosResponse<{ invite: string }>>(`/invite`)
            .then(response => response.data);
    }

}