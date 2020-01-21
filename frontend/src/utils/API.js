import Axios from "axios";
import { API_URL, TOKEN_COOKIE_NAME } from "../configs/constants";
import { getCookie, setCookie } from "./CookieHelper";
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

    static getPopularIDList(type, refresh = false) {
        return getContentIDList("popular", type, refresh);
    }

    static getTopIDList(type, refresh = false) {
        return getContentIDList("top", type, refresh);
    }

    static search(query) {
        return AxiosI.get('/content/search', { params: { query } }).then((data) => {
            return data.data.uids;
        });
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
}, (err) => Promise.reject(err));

function getContentIDList(type, filter, refresh = false) {
    if (type !== "popular" && type !== "top") throw new Error("[API] Unknown content type");

    var cacheKey = type + "_" + filter;
    if (!refresh && API.uidCache[cacheKey])
        return Promise.resolve(API.uidCache[cacheKey]);

    return AxiosI.get(`/content/${type}`, { params: { type: filter } }).then((data) => {
        data = data.data.uids;
        API.uidCache[cacheKey] = data;

        return data;
    });
}

//Refresh token if it's going to expire
function setupTokenAutorefresh(expiration) {
    expiration -= parseInt((new Date()).getTime() / 1000);

    setTimeout(async () => {
        var data = await API.refreshToken();
        if (data.status === 200) {
            setCookie(TOKEN_COOKIE_NAME, data.data.token, new Date(data.data.expires_in * 1000));
        }
        console.log("Refreshing token!", data);
    }, (expiration - 200) * 1000);
}

export default API;