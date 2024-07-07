import Api from "./Api";

class AuthApi extends Api {
    constructor() {
        super();
    }
    
    async login(formData) {
        const response = await this.post("/api/v1/auth/login", formData)
        return response;
    }

    async register(formData) {
        const response = await this.post("/api/v1/auth/register", formData)
        return response;
    }


}

export default AuthApi;