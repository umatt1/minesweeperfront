import React from 'react';
import './style.css'

const IncomingFriendRequest = ({ requester, onAccept, onDeny }) => {
    return (
        <div className='friendRequest'>
            <h4>{requester}</h4>
            <div className='friendRequestButtons'>
                <button onClick={onAccept}>Accept</button>
                <button onClick={onDeny}>Deny</button>
            </div>
        </div>
    );
}

export default IncomingFriendRequest;
