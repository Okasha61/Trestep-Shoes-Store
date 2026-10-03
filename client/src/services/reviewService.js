import api from "./api";

export const getProductReviews = async (productId) =>
  (await api.get(`/reviews/product/${productId}`)).data;

export const getReviewEligibility = async (productId) =>
  (await api.get(`/reviews/product/${productId}/eligibility`)).data;

export const createProductReview = async (productId, reviewData) =>
  (await api.post(`/reviews/product/${productId}`, reviewData)).data;

export const getAdminReviews = async () =>
  (await api.get("/admin/reviews")).data;

export const deleteReview = async (reviewId) =>
  (await api.delete(`/reviews/${reviewId}`)).data;
