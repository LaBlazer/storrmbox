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

//Refresh token if it's going to expire
function setupTokenAutorefresh(expiration) {
    expiration -= parseInt((new Date()).getTime() / 1000);

    setTimeout(() => {
        API.refreshToken();
        console.log("Refreshing token!");
    }, (expiration - 200) * 1000);
}

class API {

    static cache = {
        '1': {
            "id": 1,
            "title": "Silicon Valley",
            "date_released": "2014-01-01",
            "date_end": null,
            "imdb_id": "tt2575988",
            "rating": null,
            "plot": null,
            "poster": "https://m.media-amazon.com/images/M/MV5BOTcwNzU2MGEtMzUzNC00MzMwLWJhZGItNDY3NDllYjU5YzAyXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_SX300.jpg",
            "trailer_youtube_id": "Vm4tx1O9GAc",
            "episode": null,
            "series": null
        },
        '2': {
            "id": 2,
            "title": "Pirates of Silicon Valley",
            "date_released": "1999-01-01",
            "date_end": null,
            "imdb_id": "tt0168122",
            "rating": null,
            "plot": null,
            "poster": "https://m.media-amazon.com/images/M/MV5BNDc2NTE0NzE4N15BMl5BanBnXkFtZTgwMDQ5MzgwMzE@._V1_SX300.jpg",
            "trailer_youtube_id": "lEyrivrjAuU",
            "episode": null,
            "series": null
        },
        3: {
            "id": 3,
            "title": "The Inventor: Out for Blood in Silicon Valley",
            "date_released": "2019-01-01",
            "date_end": null,
            "imdb_id": "tt8488126",
            "rating": null,
            "plot": null,
            "poster": "https://m.media-amazon.com/images/M/MV5BOGI4NTQxYWUtNzEzMy00MGFiLThjODItNjg4ODI5MmZiMzIwXkEyXkFqcGdeQXVyMzY0MTE3NzU@._V1_SX300.jpg",
            "trailer_youtube_id": "wtDaP18OGfw",
            "episode": null,
            "series": null
        },
        4: {
            "id": 4,
            "title": "Bill Maher: CrazyStupidPolitics - Live from Silicon Valley",
            "date_released": "2012-01-01",
            "date_end": null,
            "imdb_id": "tt2266679",
            "rating": null,
            "plot": null,
            "poster": "https://m.media-amazon.com/images/M/MV5BZjYxZTc0MTQtMTJiYi00MmZiLWJlN2UtMDQwZjkwYzJiMmJjL2ltYWdlXkEyXkFqcGdeQXVyMTM3NzQ5NzQ@._V1_SX300.jpg",
            "trailer_youtube_id": "5NKgLFrtJ5k",
            "episode": null,
            "series": null
        },
        5: {
            "id": 5,
            "title": "Start-Ups: Silicon Valley",
            "date_released": "2012-01-01",
            "date_end": null,
            "imdb_id": "tt2343117",
            "rating": null,
            "plot": null,
            "poster": "https://m.media-amazon.com/images/M/MV5BNDQ1MTY3NTE2OF5BMl5BanBnXkFtZTgwNzI1NDAxMzE@._V1_SX300.jpg",
            "trailer_youtube_id": "Vm4tx1O9GAc",
            "episode": null,
            "series": null
        },
        6: {
            "id": 6,
            "title": "Silicon Valley: The Untold Story",
            "date_released": "2018-01-01",
            "date_end": null,
            "imdb_id": "tt8128854",
            "rating": null,
            "plot": null,
            "poster": "https://m.media-amazon.com/images/M/MV5BNDEwYmI4MjQtMzQwNy00ZDM1LWE1MTgtZGM1MzI2Zjc1OGVjXkEyXkFqcGdeQXVyMzE0MjY5ODA@._V1_SX300.jpg",
            "trailer_youtube_id": "2x_Bxvlbius",
            "episode": null,
            "series": null
        },
        7: {
            "id": 7,
            "title": "Secrets of Silicon Valley",
            "date_released": "2001-01-01",
            "date_end": null,
            "imdb_id": "tt0282948",
            "rating": null,
            "plot": null,
            "poster": "https://m.media-amazon.com/images/M/MV5BOWFiYjZhM2MtZmZlNC00MGMwLTkyZWMtNTBmNTA5YTFlOTA3XkEyXkFqcGdeQXVyNTM3MDMyMDQ@._V1_SX300.jpg",
            "trailer_youtube_id": "TbKxUYl3WSE",
            "episode": null,
            "series": null
        },
        8: {
            "id": 8,
            "title": "Silicon Valley Timelapse",
            "date_released": "2008-01-01",
            "date_end": null,
            "imdb_id": "tt1254346",
            "rating": null,
            "plot": null,
            "poster": "https://m.media-amazon.com/images/M/MV5BMTMyNjgwMTcyMl5BMl5BanBnXkFtZTcwNjAxODc3MQ@@._V1_SX300.jpg",
            "trailer_youtube_id": "DyGQ1-sNpOQ",
            "episode": null,
            "series": null
        }
    };

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

    static getPopularContent() {
        return AxiosI.get('/content/popular');
    }

    static search(query) {
        return AxiosI.get('/content/search', { params: { query } });
    }

    static getMediaById(id) {
        if (this.cache[id] != null)
            return Promise.resolve(this.cache[id]);

        return Promise.resolve(null);
    }
}

export default API;