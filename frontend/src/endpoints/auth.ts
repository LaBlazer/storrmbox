import qs from "qs";
import { TOKEN_COOKIE_NAME } from "../configs/constants";
import { getCookie } from "../utils/CookieHelper";
import AxiosI from "./api";


export interface AuthResponse {
    token: string,
    expires_in: number
}

export interface LoginItemModel {
    time: Date,
    ip: string,
    browser: string,
    browser_version: string,
    platform: string
}

export class AuthService {

    /**
     * Login with username and password
     * @param {String} username 
     * @param {String} password 
     * @param {Boolean} extended 
     */
    static login(username: string, password: string, extended: boolean) {
        return AxiosI.post<AuthResponse>('/auth',
            qs.stringify({ extended }), {
            headers: {
                Authorization: `Auth ${btoa(`${username}:${password}`)}`
            }
        });
    }


    /**
     * Extend token's lifespan
     *
     * @export
     * @param {boolean} [extended=false]
     * @returns
     */
    static refreshToken(extended = false) {
        return AxiosI.post<AuthResponse>('/auth', qs.stringify({ extended }));
    }

    /**
     * List all login history
     *
     * @static
     * @memberof AuthService
     */
    static list() {
        return AxiosI.get<{ time: string, ip: string, platform: string, browser: string, browser_version: string}[]>('/auth/list')
            .then((list) => list.data.map((item) => ({ ...item, time: new Date(item.time) }) as LoginItemModel));
    }

    /**
     *  Purge all logins.
     *
     * @static
     * @memberof AuthService
     */
    static purge() {
        return AxiosI.post('/auth/purge');
    }
}

//Add authorization headers to every request
AxiosI.interceptors.request.use((config) => {

    var cookie = getCookie(TOKEN_COOKIE_NAME);

    if (cookie !== null) {
        config.headers['Authorization'] = `Bearer ${cookie}`;
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    return config;
}, (err) => Promise.reject(err));
