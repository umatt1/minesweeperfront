import axios from 'axios';

const apiUrl = window.location.hostname;

class Api {
  constructor() {
    this.instance = axios.create({
      baseURL: apiUrl,
      // timeout: 10000,
      headers: {
        'Access-Control-Allow-Origin' : "*",
        'Access-Control-Allow-Methods' :'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    });
  }

  generateConfig(token = null) {
    if (token != null) {
      return {headers: {
        "Authorization" : "Bearer " + token,
        'Access-Control-Allow-Origin' : "*",
        'Access-Control-Allow-Methods' :'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      }}
    }
    return {}
  }

  async get(endpoint, token = null) {
    try {
      const response = await axios.get(apiUrl + endpoint, this.generateConfig(token));
      return response.data;
    } catch (error) {
      console.error(error)
      throw error;
    }
  }

  async post(endpoint, data, token = null) {
    try {
      const response = await axios.post(apiUrl + endpoint, data, this.generateConfig(token));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put(endpoint, data, token = null) {
    try {
      const response = await axios.put(apiUrl + endpoint, data, this.generateConfig(token));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(endpoint, token = null) {
    try {
      const response = await axios.delete(apiUrl + endpoint, data, this.generateConfig(token));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default Api;
