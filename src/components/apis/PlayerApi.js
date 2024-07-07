import Api from "./Api";

class PlayerApi extends Api {
    constructor() {
        super();
    }

    async requestFriend(formData) {
      const response = await this.post("/")
    }
    
    // async login(formData) {
    //     const response = await this.post("/auth/login", formData)
    //     return response;
    // }

    // async register(formData) {
    //     const response = await this.post("/auth/register", formData)
    //     return response;
    // }


}

export default PlayerApi;