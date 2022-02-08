import axios from "../axios";

const endpoints = {
  login: (data) => axios.post("/v1/authentication/sign_in", data),
};

export default endpoints;
