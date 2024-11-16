import Api from "./Api";

class SolveApi extends Api {
    constructor() {
        super();
    }

    async postSolve(solve, token) {
      try {
        const response = await this.post("/api/v1/solve", solve, token)
        return response;
      } catch (error) {
        throw error;
      }
    }

    async getWeeksSolves(user, token) {
      try {
        const response = await this.get("/api/v1/solve/" + user, token);
        const toReturn = [];
        response.forEach(e => {
          // Ensure solve.puzzle.date is a valid Date object
          const [year, month, day] = e.puzzle.date.split('-').map(Number);
          const solveDate = new Date(year, month - 1, day); // month - 1 because months are 0-indexed
          // Get the short weekday string
          //const solveDayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(solveDate);
          // Assign the short weekday string to solve object
          //e.puzzle.dayOfWeek = solveDayOfWeek;
          e.puzzle.date = solveDate;
          toReturn.push(e);
        });
        return toReturn;
      } catch (error) {
        throw error;
      }
    }

    async getFriendsSolves(user, token, puzzleId) {
      try {
        const response = await this.get("/api/v1/solve/" + user + "/" + puzzleId, token);
        return response;
      } catch (error) {
        throw error;
      }
    }
    


}

export default SolveApi;