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
        console.log(response)
        return response;
    }


}

export default AuthApi;