import { axiosInstance } from "../config/axios";

export const setAuthToken = (token: string) => {
    if (token) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common.Authorization;
    }
};
