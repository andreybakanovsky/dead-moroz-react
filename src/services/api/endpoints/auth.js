import axios from "../axios";

const endpoints = {
  signup: (data) => axios.post("/v1/authentication/sign_up", data),
  login: (data) => axios.post("/v1/authentication/sign_in", data),
  getProfile: () => axios.get("/v1/profile"),
  updateProfile: (data) => axios.patch("/v1/authentication/account_update", data),

  getUsers: () => axios.get("/v1/users"),
  getUser: (id) => axios.get(`/v1/users/${id.user_id}`),

  // getKarmas: () => axios.get(`/v1/users/${id.user_id}/karmas/${id.id}`),
  // getInvitations: () => axios.get(`/v1/users/${id.user_id}/invitations`),
  // getInvitation: () => axios.get(`/v1/users/${id.user_id}/invitation/${id.id}`),

  getGoods: (id) => axios.get(`/v1/users/${id.user_id}/goods`),
  addGood: (id, data) => axios.post(`/v1/users/${id.user_id}/goods`, data),
  getGood: (id) => axios.get(`/v1/users/${id.user_id}/goods/${id.good_id}`),
  updateGood: (id, data) => axios.patch(`/v1/users/${id.user_id}/goods/${id.good_id}`, data),
  deleteGood: (id) => axios.delete(`/v1/users/${id.user_id}/goods/${id.good_id}`),
  getGoodTranslate: (id) => axios.get(`/v1/users/${id.user_id}/goods/${id.good_id}/translate`),

  getRequestedGifts: (id) => axios.get(`/v1/users/${id.user_id}/goods/${id.good_id}/gifts`),
  getRequestedGift: (id) => axios.get(`/v1/users/${id.user_id}/goods/${id.good_id}/gifts/${id.id}`),
  addGift: (id, data) => axios.post(`/v1/users/${id.user_id}/goods/${id.good_id}/gifts`, data),
  updateGift: (id, data) => axios.patch(`/v1/users/${id.user_id}/goods/${id.good_id}/gifts/${id.id}`, data),
  deleteRequestedGifts: (id) => axios.delete(`/v1/users/${id.user_id}/goods/${id.good_id}/gifts/${id.id}`),

  getReviews: (id) => axios.get(`/v1/users/${id.user_id}/goods/${id.good_id}/reviews`),
  getReview: (id) => axios.get(`/v1/users/${id.user_id}/goods/${id.good_id}/reviews/${id.id}`),
  updateReview: (id, data) => axios.patch(`/v1/users/${id.user_id}/goods/${id.good_id}/reviews/${id.id}`, data),
  addReview: (id, data) => axios.post(`/v1/users/${id.user_id}/goods/${id.good_id}/reviews`, data),
  deleteReview: (id) => axios.delete(`/v1/users/${id.user_id}/goods/${id.good_id}/reviews/${id.id}`),

  getSuggestedGifts: (id) => axios.get(`/v1/users/${id.user_id}/goods/${id.good_id}/reviews/${id.review_id}/gifts`),
  getSuggestedGift: (id) => axios.get(`/v1/users/${id.user_id}/goods/${id.good_id}/reviews/${id.review_id}/gifts/${id.id}`),
  deleteSuggestedGift: (id) => axios.delete(`/v1/users/${id.user_id}/goods/${id.good_id}/reviews/${id.review_id}/gifts/${id.id}`),
  addSuggestedGift: (id, data) => axios.post(`/v1/users/${id.user_id}/goods/${id.good_id}/reviews/${id.review_id}/gifts`, data),
  updateSuggestedGift: (id, data) => axios.patch(`/v1/users/${id.user_id}/goods/${id.good_id}/reviews/${id.review_id}/gifts/${id.id}`, data),
};

export default endpoints;
