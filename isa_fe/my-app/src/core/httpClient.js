import axios from "axios";

export const Axios = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 15000000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const get = async (url, params) => {
    return await Axios.get(url, {params})
}

export const post = async (url, params) => {
    return await Axios.post(url, {params})
}