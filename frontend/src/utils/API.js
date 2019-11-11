import Axios from "axios";
import { API_URL, TOKEN_COOKIE_NAME } from "../configs/constants";
import { getCookie } from "./CookieHelper";
import qs from 'qs';

const AxiosI = Axios.create({
    baseURL: API_URL
});

AxiosI.interceptors.request.use((config) => {

    var cookie = getCookie(TOKEN_COOKIE_NAME);
    if (cookie !== null) {
        config.headers['Authorization'] = `Bearer ${cookie}`;
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    return config;
}, (err) => {
    return Promise.reject(err);
});


class API {

    static login(username, password, extended = false) {
        return AxiosI.post('/auth', qs.stringify({extended: extended}), {
            auth: {
                username: username,
                password: password
            }
        });
    }

    static refreshToken(extended = false) {
        return AxiosI.post('/auth', qs.stringify({ extended: extended }));
    }

    static getPopularContent() {
        return AxiosI.get('/content/popular');
    }
}

export default API;