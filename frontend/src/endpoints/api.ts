import Axios from "axios";
import { API_URL } from "../configs/constants";
import { MyAxiosInstance } from "MyAxios";

const AxiosI = Axios.create({
    baseURL: API_URL
}) as MyAxiosInstance;

export default AxiosI;