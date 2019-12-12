import Axios from "axios";
import { API_URL, TOKEN_COOKIE_NAME } from "../configs/constants";
import { getCookie } from "./CookieHelper";
import qs from 'qs';

const AxiosI = Axios.create({
    baseURL: API_URL
});

class API {

    static AxiosI = AxiosI;

    static contentCache = {};
    static uidCache = {};

    /**
     * Login with username and password
     * @param {String} username 
     * @param {String} password 
     * @param {Boolean} extended 
     */
    static login(username, password, extended = false) {
        var promise = AxiosI.post('/auth', qs.stringify({ extended: extended }), {
            auth: {
                username: username,
                password: password
            }
        });

        if (extended === false) {
            return promise.then((data) => {
                setupTokenAutorefresh(data.data.expires_in);
                return data;
            });
        } else {
            return promise;
        }
    }

    static refreshToken(extended = false) {
        var promise = AxiosI.post('/auth', qs.stringify({ extended: extended }));

        if (extended === false) {
            return promise.then((data) => {
                setupTokenAutorefresh(data.data.expires_in);
                return data;
            });
        } else {
            return promise;
        }
    }

    static getPopularContent(filter, refresh = false) {
        if (!refresh && this.uidCache[filter])
            return Promise.resolve(this.uidCache[filter]);

        return AxiosI.get('/content/popular', { params: { type: filter } }).then((data) => {
            data = data.data.uids;
            this.uidCache[filter] = data;

            return data;
        });
    }

    static search(query) {
        return AxiosI.get('/content/search', { params: { query } });
    }

    static getContentByID(uid) {
        if (this.contentCache[uid] != null)
            return Promise.resolve(this.contentCache[uid]);

        return AxiosI.get(`/content/${uid}`).then((data) => {
            data = data.data;
            this.contentCache[data.uid] = data;
            return data;
        });
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
}, (err) => {
    console.log(err);

    return Promise.reject(err);
});

//Refresh token if it's going to expire
function setupTokenAutorefresh(expiration) {
    expiration -= parseInt((new Date()).getTime() / 1000);

    setTimeout(() => {
        API.refreshToken();
        console.log("Refreshing token!");
    }, (expiration - 200) * 1000);
}

export default API;