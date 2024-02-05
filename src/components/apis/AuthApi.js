import Api from "./Api";

class AuthApi extends Api {
    constructor() {
        super();
    }
    
    async login(formData) {
        const username = formData.username;
        const password = formData.password;
        const response = await this.post("/auth/login", formData)
        console.log(response)
        return response;
    }

    async register(username, password) {
        // do register
        return;
    }

    async logout(username, password) {
        // do logout
        return;
    }

}

export default AuthApi;