import Api from "./Api";

class SolveApi extends Api {
    constructor() {
        super();
    }

    async postSolve(solve, token) {
      try {
        const response = await this.post("/solve", solve, token)
        return response;
      } catch (error) {
        throw error;
      }
    }

    async getWeeksSolves(user, token) {
      try {
        const response = await this.get("/solve/"+user, token);
        return response;
      } catch (error) {
        throw error;
      }
    }


}

export default SolveApi;