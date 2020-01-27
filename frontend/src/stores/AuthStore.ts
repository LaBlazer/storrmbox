import { observable, runInAction } from 'mobx'
import { setCookie, getCookie, deleteCookie } from '../utils/CookieHelper';
import { TOKEN_COOKIE_NAME, REMEMBER_ME_COOKIE_NAME } from '../configs/constants';
import AxiosI from '../endpoints/api';
import { AuthService } from '../endpoints/auth';


class AuthStore {

    @observable
    auth: boolean = false

    @observable
    fetching: boolean = false

    private refreshTimeout: NodeJS.Timeout | null = null

    constructor() {

        //Check if user is not authorized
        //If not log him out
        AxiosI.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    runInAction(() => {
                        this.auth = false;
                    })
                }
            }

            return Promise.reject(error);
        });

    }

    /**
     * Log in with new credentials
     *
     * @param {string} username
     * @param {string} password
     * @param {boolean} [extended=false]
     * @memberof AuthStore
     */
    public login = async (username: string, password: string, extended: boolean = false) => {
        try {
            this.fetching = true;
            let response = await AuthService.login(username, password, extended);

            let { data } = response;
            if (response.status === 200) {
                setCookie(TOKEN_COOKIE_NAME, data.token, new Date(data.expires_in * 1000));
                if (extended) {
                    setCookie(REMEMBER_ME_COOKIE_NAME, 1, new Date(data.expires_in * 1000));
                }

                //Setup auto refreshing
                if (extended === false) {
                    this.setupTokenAutorefresh(response.data.expires_in);
                }

                this.auth = true;
            } else {
                console.error("Bad status on login: ", response.status, response.statusText);
            }
        } catch (err) {
            console.error(err);

            this.auth = false;
        } finally {
            this.fetching = false;
        }
    }

    public logout = () => {
        deleteCookie(TOKEN_COOKIE_NAME);
        deleteCookie(REMEMBER_ME_COOKIE_NAME);
        this.auth = false;
    }

    /**
     * Refresh current token
     *
     * @memberof AuthStore
     */
    public refreshToken = async () => {
        let extended = getCookie(REMEMBER_ME_COOKIE_NAME) === "1";
        let exists = getCookie(TOKEN_COOKIE_NAME) !== null;

        if (!exists) return;
        this.fetching = true;
        let response = await AuthService.refreshToken(extended);

        if (response.status === 200) {
            let { data } = response;
            setCookie(TOKEN_COOKIE_NAME, data.token, new Date(data.expires_in * 1000));

            if (extended === true) {
                setCookie(REMEMBER_ME_COOKIE_NAME, 1, new Date(data.expires_in * 1000));
            } else {
                this.setupTokenAutorefresh(data.expires_in);
            }

            this.auth = true;
        }
        this.fetching = false;
    }

    //Refresh token if it's going to expire
    private setupTokenAutorefresh(expiration: number) {
        expiration -= Math.round((new Date()).getTime() / 1000);

        if (this.refreshTimeout !== null) clearTimeout(this.refreshTimeout);

        this.refreshTimeout = setTimeout(async () => {
            await this.refreshToken();
            console.log("Refreshing token!");
        }, (expiration - 200) * 1000);
    }

}

export default new AuthStore();


