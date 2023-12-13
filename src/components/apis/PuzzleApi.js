import axios from 'axios';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

class PuzzleApi {
  constructor() {
    this.instance = axios.create({
      baseURL: apiUrl,
      // timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  renderPuzzle(puzzle) {
    const newLayout = [];
    for (let rowInd = 0; rowInd < puzzle.height; rowInd++) {
      let row = puzzle.layout.slice(rowInd * puzzle.width, (rowInd * puzzle.width) + puzzle.width);
      newLayout.push(row);
    }
    puzzle.layout = newLayout;
  }

  async getPuzzleOfTheDay() {
    try {
      const puzzle = await this.get('/puzzles/getPuzzleByDate');
      this.renderPuzzle(puzzle);
      return puzzle;
    } catch (error) {
      throw error;
    }
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

export default PuzzleApi;
