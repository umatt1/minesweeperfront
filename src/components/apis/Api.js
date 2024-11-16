import axios from 'axios';

// const apiUrl = this.window.hostname
const apiUrl = "http://localhost:80"

class Api {
  constructor() {
    this.instance = axios.create({
      baseURL: apiUrl,
      // timeout: 10000,
      headers: {
        'Accept': 'application/json',  // Accept header is enough for most cases
      },
    });
  }

  /**
   * Generate a config object suitable for passing to Axios.
   *
   * @param {string} [token=null] - The JWT token to include in the request headers.
   * @param {Object} [data=null] - The data to send in the request body.
   *
   * @returns {Object} The config object to pass to Axios.
   */
  generateConfig(token = null, data = null) {
    const config = {
      headers: {
        'Accept': 'application/json',
      },
    };

    if (token != null) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    return config;
  }

  /**
   * Performs a GET request to the specified endpoint with the given token.
   * @param {string} endpoint The endpoint to send the request to.
   * @param {string} [token=null] The JWT token to include in the request headers.
   * @returns {Promise<Object>} The response data from the server.
   * @throws {Error} If there is an error with the request.
   */
  async get(endpoint, token = null) {
    try {
      const response = await this.instance.get(endpoint, this.generateConfig(token));
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Performs a POST request to the specified endpoint with the given data and token.
   * @param {string} endpoint The endpoint to send the request to.
   * @param {Object} data The data to send in the request body.
   * @param {string} [token=null] The JWT token to include in the request headers.
   * @returns {Promise<Object>} The response data from the server.
   * @throws {Error} If there is an error with the request.
   */
  async post(endpoint, data, token = null) {
    try {
      const response = await this.instance.post(endpoint, data, this.generateConfig(token));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Performs a PUT request to the specified endpoint with the given data and token.
   * @param {string} endpoint The endpoint to send the request to.
   * @param {Object} data The data to send in the request body.
   * @param {string} [token=null] The JWT token to include in the request headers.
   * @returns {Promise<Object>} The response data from the server.
   * @throws {Error} If there is an error with the request.
   */
  async put(endpoint, data, token = null) {
    try {
      const response = await this.instance.put(endpoint, data, this.generateConfig(token));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Performs a DELETE request to the specified endpoint with the given token.
   * @param {string} endpoint The endpoint to send the request to.
   * @param {string} [token=null] The JWT token to include in the request headers.
   * @returns {Promise<Object>} The response data from the server.
   * @throws {Error} If there is an error with the request.
   */
  async delete(endpoint, token = null) {
    try {
      const response = await this.instance.delete(endpoint, this.generateConfig(token));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default Api;
