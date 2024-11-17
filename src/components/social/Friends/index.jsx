import React, { useState, useEffect } from "react";
import { Container, Alert, Card, Stack } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import PlayerApi from "../../apis/PlayerApi";
import FriendCard from "../FriendCard";
import FriendRequests from "../FriendRequests";
import FriendRequestForm from "../../forms/requestFriend";

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
            <Stack gap={4} className="mx-auto" style={{ maxWidth: '600px' }}>
                {/* Friend Requests Section */}
                <FriendRequests />
                
                {/* Send Friend Request Section */}
                <FriendRequestForm />
                
                {/* Friends List Section */}
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
                            <Stack gap={2}>
                                {friends.map((friend) => (
                                    <FriendCard 
                                        key={friend.id} 
                                        friend={friend} 
                                        onRemoveFriend={(friendId) => {
                                            handleRemoveFriend(friendId);
                                            fetchFriends();
                                        }} 
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Alert variant="info">
                                No friends found.
                            </Alert>
                        )}
                    </Card.Body>
                </Card>
            </Stack>
        </Container>
    );
}

export default Friends;
