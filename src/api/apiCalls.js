import axios from "axios";
import i18n from "../locale/i18n";

import { store } from "../state/store";
axios.interceptors.request.use((request) => {
  request.headers["Accept-Language"] = i18n.language;
  request.headers["Authorization"] = store.getState().header;

  //todo 82. Logout

  // const { header } = store.getState;
  // if (header) {
  //   request.headers["Authorization"] = store.getState().header;
  // }

  return request;
});

export const signup = (body) => {
  return axios.post(
    "/api/1.0/users",
    body
    // // added in axios interceptors
    //     {
    //       headers: {
    //     "Accept-Language": i18n.language,
    //   },
    // }
  );
};

export const activate = (token) => {
  return axios.post(`/api/1.0/users/token/${token}`);
};

export const loadUsers = (page) => {
  return axios.get("/api/1.0/users", {
    params: { page, size: 3 },
  });
};

export const getUserById = (id) => {
  return axios.get(`/api/1.0/users/${id}`);
};

export const login = (body) => {
  return axios.post(
    "/api/1.0/auth",
    body
    //  // added in axios interceptors
    //     {
    //   headers: {
    //     "Accept-Language": i18n.language,
    //   },
    // }
  );
};

export const updateUser = (
  id,
  body
  // header
) => {
  return axios.put(
    `/api/1.0/users/${id}`,
    body
    // Fixed by interceptor in AXIOS
    //     {
    //   headers: {
    //     Authorization: header,
    //   },
    // }
  );
};

export const logout = () => {
  return axios.post("/api/1.0/logout");
};
