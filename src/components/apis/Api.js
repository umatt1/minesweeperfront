import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

class Api {
  constructor() {
    this.instance = axios.create({
      baseURL: apiUrl,
      // timeout: 10000,
      headers: {
      },
    });
  }

  generateConfig(token = null) {
    if (token != null) {
      return {
        Authorization : `Bearer ${token}`,
      }
    }
    return {}
  }

  async get(endpoint, token = null) {
    try {
      console.log(`GETTING ${endpoint} WITH TOKEN ${token}`)
      console.log(this.generateConfig(token))
      const response = await this.instance.get(endpoint, {}, this.generateConfig(token));
      console.log(response)
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post(endpoint, data, token = null) {
    try {
      const response = await this.instance.post(endpoint, data, this.generateConfig(token));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put(endpoint, data, token = null) {
    try {
      const response = await this.instance.put(endpoint, data, this.generateConfig(token));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(endpoint, token = null) {
    try {
      const response = await this.instance.delete(endpoint, data, this.generateConfig(token));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default Api;
