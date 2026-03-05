import axios from "axios";
export const comonApi = async (httpRequest, url, reqData, reqHeader) => {
    const reqConfig = {
        method: httpRequest,
        url: url,
        data: reqData,
        withCredentials: true,
        headers: reqHeader ? reqHeader : (reqData instanceof FormData ? {} : { "Content-Type": "application/json" })
    }
    return await axios(reqConfig).then((res) => {
        return res.data
    }).catch((err) => {
        return err.response?.data || { success: false, message: err.message }
    })
}
