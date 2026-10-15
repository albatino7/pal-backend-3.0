import apiClient from "../../../services/apiClient";

export const urlApi = {
  /**
   * Fetch all shortened URLs from the backend
   * @returns {Promise<Array>} Array of URL objects
   */
  async getAllUrls() {
    const response = await apiClient.get("/api/url/get-url");
    return response.data?.allUrl || [];
  },

  /**
   * Generate a new shortened URL
   * @param {Object} payload { url: string }
   * @returns {Promise<Object>} Created URL object
   */
  async createShortUrl({ url }) {
    const response = await apiClient.post("/api/url/genrate", { url });
    return response.data?.finalResult;
  },

  /**
   * Delete a shortened URL by its shortCode
   * @param {string} shortCode
   * @returns {Promise<Object>} Response message
   */
  async deleteUrl(shortCode) {
    const response = await apiClient.delete(`/api/url/delete/${shortCode}`);
    return response.data;
  },
};

export default urlApi;
