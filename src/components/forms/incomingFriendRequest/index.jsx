import React from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';

const IncomingFriendRequest = ({ requester, onAccept, onDeny }) => {
    return (
        <Card className="mb-3">
            <Card.Body className="d-flex justify-content-between align-items-center">
                <Card.Title className="mb-0">
                    {requester}
                </Card.Title>
                <ButtonGroup>
                    <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={onAccept}
                    >
                        Accept
                    </Button>
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={onDeny}
                    >
                        Deny
                    </Button>
                </ButtonGroup>
            </Card.Body>
        </Card>
    );
}

export default IncomingFriendRequest;
