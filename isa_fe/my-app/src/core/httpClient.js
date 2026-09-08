import axios from "axios";

export const Axios = axios.create({
    baseURL: "http://localhost:8080/",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

export const get = async (url, params = {}) => {
    return Axios.get(url, {params});
};

export const post = async (url, data) => {
    return Axios.post(url, data);
};

export const put = async (url, data) => {
    return Axios.put(url, data);
};

export const remove = async (url) => {
    return Axios.delete(url);
};