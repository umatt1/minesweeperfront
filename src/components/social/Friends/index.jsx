import React, { useState, useEffect } from "react";
import "./style.css";
import { useCookies } from "react-cookie";
import PlayerApi from "../../apis/PlayerApi";
import FriendCard from "../FriendCard";

const playerApi = new PlayerApi();

const Friends = () => {
    const [cookies] = useCookies(['username','jwt']);
    const [friends, setFriends] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");


    const fetchFriends = async () => {
        try {
            const response = await playerApi.getFriends(cookies.username, cookies.jwt);
            setFriends(response || []);
        } catch (error) {
            setErrorMessage("Failed to fetch friends.");
        }
    };

    useEffect(() => {

        fetchFriends();
    }, [cookies.jwt, cookies.username]);

    const handleRemoveFriend = async (friendId) => {
        console.log("deleteme", cookies['username'], friendId)
        try {
            await playerApi.removeFriend(cookies['username'], friendId, cookies.jwt);
            setFriends((prevFriends) => prevFriends.filter(friend => friend.id !== friendId));
        } catch (error) {
            setErrorMessage("Failed to remove the friend.");
        }
    };

    return (
        <div className="friendsList">
            <h2>Your Friends</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {console.log("friends", friends)}
            {friends.length > 0 ? (
                friends.map((friend) => (
                    <FriendCard 
                        key={friend.id} 
                        friend={friend} 
                        onRemoveFriend={(friendId) => {handleRemoveFriend(friendId); fetchFriends();}} 
                    />
                ))
            ) : (
                <p>No friends found.</p>
            )}
        </div>
    );
}

export default Friends;
