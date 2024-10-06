import Api from "./Api";

class PlayerApi extends Api {
    constructor() {
        super();
    }

    // Method to request a friend
    async requestFriend(data, token) {
        return await this.post("/api/v1/friends/request", data, token);
    }

    // Method to get all incoming friend requests
    async getFriendRequests(token) {
        return await this.get("/api/v1/friends/requests", token);
    }

    // Method to accept a friend request
    async acceptFriendRequest(requestId, token) {
        return await this.post(`/api/v1/friends/accept/${requestId}`, {}, token);
    }

    // Method to deny a friend request
    async denyFriendRequest(requestId, token) {
        return await this.post(`/api/v1/friends/deny/${requestId}`, {}, token);
    }
}

export default PlayerApi;
