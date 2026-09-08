import {useCallback, useState} from "react";
import axios from "axios";

const useListData = (url) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const getData = useCallback(async (url) => {
        setLoading(true);
        let res = await axios.get(url);
        setData(res.data);
        setLoading(false);
    }, [url]);
    return {getData, loading, data};
}
export default useListData;