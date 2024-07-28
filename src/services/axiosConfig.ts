// import axios from "axios";
// import { BASE_URL } from "./apiConfig";
// import { useSelector } from "react-redux";
// import { RootState } from "@reduxjs/toolkit/query";
// // Set the base URL for your API
// axios.defaults.baseURL = BASE_URL;
// const { userData } = useSelector((state: RootState) => state.auth);
// // Add an Axios interceptor to set the authorization token for every request
// axios.interceptors.request.use(
//   (config) => {
//     const token = userData?.token;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axios;
