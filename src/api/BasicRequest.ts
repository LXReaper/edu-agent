import axios from "axios";

export const BACKEND_URL = "http://localhost:8312/api/server";

export const BasicRequest = () => {
    return axios.create({
        baseURL: BACKEND_URL,
    });
}
