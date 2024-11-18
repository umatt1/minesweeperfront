import Api from "./Api";

class StatisticsApi extends Api {
    constructor() {
        super();
    }

    async getTotalUsers(token) {
        try {
            const response = await this.get("/api/v1/statistics/users/total", token);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getTotalSolves(token) {
        try {
            const response = await this.get("/api/v1/statistics/solves/total", token);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default StatisticsApi;
