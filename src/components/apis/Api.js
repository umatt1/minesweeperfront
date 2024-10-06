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

  async get(endpoint, token = null) {
    try {
      const response = await this.instance.get(endpoint, this.generateConfig(token));
      return response.data;
    } catch (error) {
      console.error(error);
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
      const response = await this.instance.delete(endpoint, this.generateConfig(token));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default Api;
