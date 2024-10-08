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
                setFriendRequests(response || []);
            } catch (error) {
                setErrorMessage("Failed to fetch friend requests.");
            }
        };

        fetchFriendRequests();

    }, [cookies.jwt]);

    const handleAccept = async (requester, requested) => {
        try {
            await playerApi.acceptFriendRequest(requester, requested, cookies.jwt);
            setSuccessMessage("Friend request accepted!");
            setFriendRequests((prevRequests) => prevRequests.filter(req => req.requester !== requester && req.requested !== requested));  // Remove the accepted request from the list
        } catch (error) {
            setErrorMessage("Failed to accept the friend request.");
        }
    };

    const handleDeny = async (requester, requested) => {
        try {
            await playerApi.denyFriendRequest(requester, requested, cookies.jwt);
            setSuccessMessage("Friend request denied!");
            setFriendRequests((prevRequests) => prevRequests.filter(req => req.requester !== requester && req.requested !== requested));  // Remove the denied request from the list
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
                        requester={request.requester} 
                        onAccept={() => handleAccept(request.requester, request.requested)} 
                        onDeny={() => handleDeny(request.requester, request.requested)} 
                    />
                ))
            ) : (
                <p>No incoming friend requests.</p>
            )}
        </div>
    );
}

export default FriendRequests;
