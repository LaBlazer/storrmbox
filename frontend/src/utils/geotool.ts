import Axios from "axios";

type GeoResponse = {
    ip: string,
    country_code: string,
    country_name: string,
    region_code: string,
    region_name: string,
    city: string,
    zip_code: string,
    time_zone: string,
    latitude: number,
    longitude: number,
    metro_code: number
}

export async function fetchGeoIPInfo(ip: string, flagSize = 32) {
    let geo = await Axios.get<GeoResponse>(`https://freegeoip.app/json/${ip}`);
    let geoData = geo.data as GeoResponse & { flag: string };
    geoData['flag'] = `https://www.countryflags.io/${geoData.country_code}/flat/${flagSize}.png`;
    return geoData;
}