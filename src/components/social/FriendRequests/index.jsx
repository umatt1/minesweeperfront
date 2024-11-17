import IncomingFriendRequest from "../../forms/incomingFriendRequest";
import React, { useState, useEffect } from "react";
import { Container, Card, Alert } from 'react-bootstrap';
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
                setErrorMessage("");
            } catch (error) {
                setErrorMessage("Failed to fetch friend requests.");
                setSuccessMessage("");
            }
        };

        fetchFriendRequests();
    }, [cookies.jwt]);

    const handleAccept = async (requester, requested) => {
        try {
            await playerApi.acceptFriendRequest(requester, requested, cookies.jwt);
            setSuccessMessage("Friend request accepted!");
            setErrorMessage("");
            setFriendRequests((prevRequests) => 
                prevRequests.filter(req => req.requester !== requester && req.requested !== requested)
            );
        } catch (error) {
            setErrorMessage("Failed to accept the friend request.");
            setSuccessMessage("");
        }
    };

    const handleDeny = async (requester, requested) => {
        try {
            await playerApi.denyFriendRequest(requester, requested, cookies.jwt);
            setSuccessMessage("Friend request denied!");
            setErrorMessage("");
            setFriendRequests((prevRequests) => 
                prevRequests.filter(req => req.requester !== requester && req.requested !== requested)
            );
        } catch (error) {
            setErrorMessage("Failed to deny the friend request.");
            setSuccessMessage("");
        }
    };

    return (
        <Container className="py-4">
            <Card>
                <Card.Header>
                    <h4 className="mb-0">Incoming Friend Requests</h4>
                </Card.Header>
                <Card.Body>
                    {errorMessage && (
                        <Alert variant="danger" className="mb-3">
                            {errorMessage}
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert variant="success" className="mb-3">
                            {successMessage}
                        </Alert>
                    )}
                    
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
                        <Alert variant="info">
                            No incoming friend requests.
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default FriendRequests;
