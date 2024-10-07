import IncomingFriendRequest from "../../forms/incomingFriendRequest";
import React, { useState, useEffect } from "react";
import "./style.css";
import { useCookies } from "react-cookie";
import PlayerApi from "../../apis/PlayerApi";

const playerApi = new PlayerApi();

const FriendRequests = () => {
    const [cookies] = useCookies(['username','jwt']);
    const [friendRequests, setFriendRequests] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await playerApi.getFriendRequests(cookies.jwt, cookies.username);
                setFriendRequests(response.friendRequests || []);
            } catch (error) {
                setErrorMessage("Failed to fetch friend requests.");
            }
        };

    }, [cookies.jwt]);

    const handleAccept = async (requestId) => {
        try {
            await playerApi.acceptFriendRequest(requestId, cookies.jwt);
            setSuccessMessage("Friend request accepted!");
            setFriendRequests((prevRequests) => prevRequests.filter(req => req.id !== requestId));  // Remove the accepted request from the list
        } catch (error) {
            setErrorMessage("Failed to accept the friend request.");
        }
    };

    const handleDeny = async (requestId) => {
        try {
            await playerApi.denyFriendRequest(requestId, cookies.jwt);
            setSuccessMessage("Friend request denied!");
            setFriendRequests((prevRequests) => prevRequests.filter(req => req.id !== requestId));  // Remove the denied request from the list
        } catch (error) {
            setErrorMessage("Failed to deny the friend request.");
        }
    };

    return (
        <div className="friendRequests">
            <h2>Incoming Friend Requests</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            {friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                    <IncomingFriendRequest 
                        key={request.id} 
                        requester={request.username} 
                        onAccept={() => handleAccept(request.id)} 
                        onDeny={() => handleDeny(request.id)} 
                    />
                ))
            ) : (
                <p>No incoming friend requests.</p>
            )}
        </div>
    );
}

export default FriendRequests;
