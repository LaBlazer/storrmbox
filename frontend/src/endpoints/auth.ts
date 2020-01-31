import AxiosI from "./api"
import qs from "qs"
import { getCookie } from "../utils/CookieHelper";
import { TOKEN_COOKIE_NAME } from "../configs/constants";
import { AxiosResponse } from "axios";


interface AuthResponse {
    token: string,
    expires_in: number
}

export class AuthService {

    /**
     * Login with username and password
     * @param {String} username 
     * @param {String} password 
     * @param {Boolean} extended 
     */
    static login(username: string, password: string, extended: boolean) {
        return AxiosI.post<any, AxiosResponse<AuthResponse>>('/auth',
            qs.stringify({ extended }), {
            auth: {
                username,
                password
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
        return AxiosI.post<any, AxiosResponse<AuthResponse>>('/auth', qs.stringify({ extended }));
    }
}

//Add authorization headers to every request
AxiosI.interceptors.request.use((config) => {

    var cookie = getCookie(TOKEN_COOKIE_NAME);

    if (cookie !== null) {
        config.headers['Authorization'] = `Token ${cookie}`;
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    return config;
}, (err) => Promise.reject(err));
