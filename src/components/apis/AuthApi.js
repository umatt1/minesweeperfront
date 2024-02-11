import Api from "./Api";

class AuthApi extends Api {
    constructor() {
        super();
    }
    
    async login(formData) {
        const response = await this.post("/auth/login", formData)
        return response;
    }

    async register(formData) {
        const response = await this.post("/auth/register", formData)
        return response;
    }


}

export default AuthApi;