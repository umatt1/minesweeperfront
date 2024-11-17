import React from "react";
import { Card, Button, ButtonGroup } from 'react-bootstrap';

const FriendCard = ({ friend, onRemoveFriend }) => {
    return (
        <Card className="mb-3">
            <Card.Body className="d-flex justify-content-between align-items-center">
                <Card.Title className="mb-0">{friend}</Card.Title>
                <ButtonGroup>
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => onRemoveFriend(friend)}
                    >
                        Remove
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        size="sm"
                    >
                        View Profile
                    </Button>
                </ButtonGroup>
            </Card.Body>
        </Card>
    );
}

export default FriendCard;
