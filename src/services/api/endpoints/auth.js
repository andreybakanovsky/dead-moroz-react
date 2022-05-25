import axios from "../axios";

const endpoints = {
  signup: (data) => axios.post("/v1/authentication/sign_up", data),
  checkInvitationSignup: (id, data) => axios.post(`/v1/authentication/sign_up/${id}/`, data),

  login: (data) => axios.post("/v1/authentication/sign_in", data),
  getProfile: () => axios.get("/v1/profile"),
  updateProfile: (data) => axios.patch("/v1/authentication/account_update", data),

  getUsers: (params) => axios.get(`/v1/users?page_size=${params.page_size}&page=${params.page}`),
  getUser: (id) => axios.get(`/v1/users/${id.user_id}`),
  deleteUser: (id) => axios.delete(`/v1/users/${id}`),
  getUserAvarageGrade: (id) => axios.get(`/v1/users/${id.user_id}/average_grade`),
  getUserYears: (id) => axios.get(`/v1/users/${id.user_id}/good_years`),
  getSuggestedGiftsForYear: (id, year) => axios.get(`/v1/users/${id.user_id}/suggested_gifts/${year}`),
  getRequestedGiftsForYear: (id, year) => axios.get(`/v1/users/${id.user_id}/requested_gifts/${year}`),
  getReviewsForYear: (id, year) => axios.get(`/v1/users/${id.user_id}/reviews/${year}`),

  getKarma: (id) => axios.get(`/v1/users/${id}/karma`),
  getApprovedGifts: (id) => axios.get(`/v1/users/${id}/karma/approved_gifts`),

  getInvitations: () => axios.get(`/v1/invitations`),
  addInvitation: (data) => axios.post(`/v1/invitations`, data),
  deleteInvitation: (id) => axios.delete(`/v1/invitations/${id}`),
  sendInvitation: (id) => axios.get(`/v1/invitations/${id}/send_by_email`),
  getInvitation: (id) => axios.get(`/v1/invitations/${id}`),
  updateInvitation: (id, data) => axios.patch(`/v1/invitations/${id}`, data),

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
  getGiftsTranslate: (id) => axios.get(`/v1/users/${id.user_id}/goods/${id.good_id}/gifts/translate`),

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
  updateDeadChoice: (id, data) => axios.patch(`/v1/gifts/${id}`, data),
};

export default endpoints;
