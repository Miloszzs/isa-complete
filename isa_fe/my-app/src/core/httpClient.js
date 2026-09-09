import axios from "axios";

export const Axios = axios.create({
    baseURL: "http://localhost:8080/",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

Axios.interceptors.request.use((config) => {
    if (typeof window === "undefined") {
        return config;
    }

    const requestUrl = new URL(config.url, config.baseURL);
    const apiOrigin = new URL(Axios.defaults.baseURL).origin;

    if (requestUrl.origin !== apiOrigin) {
        return config;
    }

    const isPublicRequest = config.method?.toLowerCase() === "post"
        && ["/auth/login", "/user/create-user-body"].includes(requestUrl.pathname);

    if (!isPublicRequest) {
        const token = sessionStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

Axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== "undefined" && error.response?.status === 401) {
            const token = sessionStorage.getItem("accessToken");
            const sentAuthorization = error.config?.headers?.Authorization;

            // Ne odjavljuj novu sesiju zbog zakasnelog odgovora za stari token.
            if (token && sentAuthorization === `Bearer ${token}`) {
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("user");
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    }
);

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