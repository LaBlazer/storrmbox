export class ContentService {
    
}

//     static getPopularIDList(type, refresh = false) {
//     return getContentIDList("popular", type, refresh);
// }

//     static getTopIDList(type, refresh = false) {
//     return getContentIDList("top", type, refresh);
// }

//     static search(query) {
//     return AxiosI.get('/content/search', { params: { query } }).then((data) => {
//         return data.data.uids;
//     });
// }

//     static getContentByID(uid) {
//     if (this.contentCache[uid] != null)
//         return Promise.resolve(this.contentCache[uid]);

//     return AxiosI.get(`/content/${uid}`).then((data) => {
//         data = data.data;
//         this.contentCache[data.uid] = data;
//         return data;
//     });
// }

// function getContentIDList(type, filter, refresh = false) {
//     if (type !== "popular" && type !== "top") throw new Error("[API] Unknown content type");

//     var cacheKey = type + "_" + filter;
//     if (!refresh && API.uidCache[cacheKey])
//         return Promise.resolve(API.uidCache[cacheKey]);

//     return AxiosI.get(`/content/${type}`, { params: { type: filter } }).then((data) => {
//         data = data.data.uids;
//         API.uidCache[cacheKey] = data;

//         return data;
//     });
// }