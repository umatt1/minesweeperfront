import Api from "./Api";

class PlayerApi extends Api {
    constructor() {
        super();
    }

    // Method to request a friend
    async requestFriend(data, token) {
        return await this.post("/api/v1/user/request", data, token);
    }

    // Method to get all incoming friend requests
    async getFriendRequests(token, username) {
        return await this.get(`/api/v1/user/request/${username}`, token);
    }

    // Method to accept a friend request
    async acceptFriendRequest(requester, requested, token) {
        return await this.put(`/api/v1/user/request/respond/accept`, {requester: requester, requested: requested}, token);
    }

    // Method to deny a friend request
    async denyFriendRequest(requester, requested, token) {
        return await this.put(`/api/v1/user/request/respond/decline`, {requester: requester, requested: requested}, token);
    }

    async getFriends(requester, token) {
        return await this.get(`/api/v1/user/friends/${requester}`, token)
    }
}

export default PlayerApi;
