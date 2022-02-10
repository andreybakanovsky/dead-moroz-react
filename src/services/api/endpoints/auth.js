import axios from "../axios";

const endpoints = {
  login: (data) => axios.post("/v1/authentication/sign_in", data),
  getProfile: () => axios.get("/v1/profile"),
  updateProfile: (data) => axios.patch("/v1/authentication/account_update", data),
};

export default endpoints;
