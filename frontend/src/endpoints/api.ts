import Axios from "axios";
import { API_URL } from "../configs/constants";

const AxiosI = Axios.create({
    baseURL: API_URL
});

export default AxiosI;