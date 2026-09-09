import axios from "axios";

export const Axios = axios.create({
    baseURL: "http://localhost:8080/",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

const isPublicRequest = (config) => {

    const requestUrl = new URL(
        config.url,
        config.baseURL
    );

    const method =
        config.method?.toLowerCase();

    const path =
        requestUrl.pathname;

    if (
        method === "post" &&
        [
            "/auth/login",
            "/user/create-user-body"
        ].includes(path)
    ) {
        return true;
    }

    if (
        method === "get" &&
        [
            "/product/get-product-list",
            "/category/get-category-list"
        ].includes(path)
    ) {
        return true;
    }

    return false;
};


Axios.interceptors.request.use((config) => {

    if (typeof window === "undefined") {
        return config;
    }

    const requestUrl =
        new URL(config.url, config.baseURL);

    const apiOrigin =
        new URL(Axios.defaults.baseURL).origin;

    if (requestUrl.origin !== apiOrigin) {
        return config;
    }

    if (!isPublicRequest(config)) {

        const token =
            sessionStorage.getItem("accessToken");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }
    }

    return config;
});


Axios.interceptors.response.use(

    (response) => response,

    (error) => {

        if (
            typeof window !== "undefined" &&
            error.response?.status === 401
        ) {

            const token =
                sessionStorage.getItem("accessToken");

            const sentAuthorization =
                error.config?.headers?.Authorization;

            /*
             * Sesiju brisemo samo ako je 401
             * dosao sa zahteva koji je stvarno
             * koristio trenutni JWT.
             *
             * Javni GET zahtevi ne salju JWT.
             */
            if (
                token &&
                sentAuthorization === `Bearer ${token}`
            ) {

                sessionStorage.removeItem(
                    "accessToken"
                );

                sessionStorage.removeItem(
                    "user"
                );

                window.location.replace(
                    "/login"
                );
            }
        }

        return Promise.reject(error);
    }
);


export const get = async (
    url,
    params = {}
) => {

    return Axios.get(
        url,
        {params}
    );
};


export const post = async (
    url,
    data
) => {

    return Axios.post(
        url,
        data
    );
};


export const put = async (
    url,
    data
) => {

    return Axios.put(
        url,
        data
    );
};


export const remove = async (
    url
) => {

    return Axios.delete(url);
};