// Api.js
import axios from 'axios';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

class PlayerApi {
  constructor() {
    this.instance = axios.create({
      baseURL: apiUrl,
      //timeout: 10000,
      //headers: {
        //'Content-Type': 'application/json',
        // You can add other headers here
      //},
    });
  }

  async get(endpoint) {
    try {
      //const response = await this.instance.get(endpoint);
      const response = await axios.get(process.env.REACT_APP_BACKEND_URL+endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await this.instance.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put(endpoint, data) {
    try {
      const response = await this.instance.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await this.instance.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default PlayerApi;