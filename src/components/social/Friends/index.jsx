import React, { useState, useEffect } from "react";
import { Container, Alert, Card } from 'react-bootstrap';
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
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Failed to fetch friends.");
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [cookies.jwt, cookies.username]);

    const handleRemoveFriend = async (friendId) => {
        try {
            await playerApi.removeFriend(cookies['username'], friendId, cookies.jwt);
            setFriends((prevFriends) => prevFriends.filter(friend => friend.id !== friendId));
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Failed to remove the friend.");
        }
    };

    return (
        <Container className="py-4">
            <Card>
                <Card.Header>
                    <h4 className="mb-0">Your Friends</h4>
                </Card.Header>
                <Card.Body>
                    {errorMessage && (
                        <Alert variant="danger" className="mb-3">
                            {errorMessage}
                        </Alert>
                    )}
                    
                    {friends.length > 0 ? (
                        friends.map((friend) => (
                            <FriendCard 
                                key={friend.id} 
                                friend={friend} 
                                onRemoveFriend={(friendId) => {
                                    handleRemoveFriend(friendId);
                                    fetchFriends();
                                }} 
                            />
                        ))
                    ) : (
                        <Alert variant="info">
                            No friends found.
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Friends;
