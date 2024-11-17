import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import PlayerApi from '../../apis/PlayerApi';
import { useCookies } from 'react-cookie';

const api = new PlayerApi();

const FriendRequestForm = () => {
    const [cookies] = useCookies(['jwt, username']);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        requester: cookies.username,
        requested: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear any previous messages when user starts typing
        setMessage(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.requestFriend(formData, cookies.jwt);
            if (toString(response.requester) === toString(formData.requester) && 
                toString(response.requested) === toString(formData.requested)) {
                setMessage({
                    type: 'success',
                    text: `Friend request to ${formData.requested} sent successfully!`
                });
                // Clear the form
                setFormData({
                    ...formData,
                    requested: ''
                });
            } else {
                setMessage({
                    type: 'danger',
                    text: 'Friend request failed!'
                });
            }
        } catch (error) {
            console.error(error);
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || 'An error occurred while sending the friend request.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title className="text-center mb-4">Request Friend</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Friend's Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="requested"
                            value={formData.requested}
                            onChange={handleChange}
                            placeholder="Enter username"
                            disabled={isLoading}
                        />
                        <Form.Control
                            type="hidden"
                            name="requester"
                            value={cookies.username}
                        />
                    </Form.Group>
                    
                    {message && (
                        <Alert 
                            variant={message.type}
                            className="mb-3"
                            dismissible
                            onClose={() => setMessage(null)}
                        >
                            {message.text}
                        </Alert>
                    )}

                    <div className="d-grid">
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={isLoading || !formData.requested.trim()}
                        >
                            {isLoading ? 'Sending...' : 'Send Request'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default FriendRequestForm;
