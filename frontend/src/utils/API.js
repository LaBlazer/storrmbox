import Axios from "axios";
import { API_URL, TOKEN_COOKIE_NAME } from "../configs/constants";
import { getCookie } from "./CookieHelper";

const AxiosI = Axios.create({
    baseURL: API_URL
});

AxiosI.interceptors.request.use((config) => {
    
    var cookie = getCookie(TOKEN_COOKIE_NAME);
    if (cookie !== null) {
        config.headers['Authorization'] = `Bearer ${cookie}`;
    }
    
    return config;
}, (err) => {
    return Promise.reject(err);
});


class API {

    static login(username, password) {
        return AxiosI.post('/auth', {}, {
            auth: {
                username: username,
                password: password
            }
        });
    }

    static refreshToken() {
        return AxiosI.post('/auth');
    }

    static getPopularContent() {
        return AxiosI.get('/content/popular');
    }
}

export default API;