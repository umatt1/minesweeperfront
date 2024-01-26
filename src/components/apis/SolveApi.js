import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

class SolveApi {
  constructor() {
    this.instance = axios.create({
      baseURL: apiUrl,
      // timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async get(endpoint) {
    try {
      const response = await this.instance.get(endpoint);
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

export default SolveApi;
