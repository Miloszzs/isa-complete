import {useCallback, useState} from "react";
import {get} from "@/core/httpClient";

const useListData = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const getData = useCallback(async (url, params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await get(url, params);
            setData(response.data);
        } catch (err) {
            console.error("GET request failed:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {getData, loading, data, error};
};

export default useListData;