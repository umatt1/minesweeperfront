import React, {useState} from 'react';
import './style.css'


const IncomingFriendRequest = ({requester}) => {

    
    return (<div className='friendRequest'>
            <h4>{requester}</h4>
            <br></br>
            <div className='friendRequestButtons'> 
                <button>Accept</button>
                <button>Deny</button>
            </div>
        </div>
    );
}

export default IncomingFriendRequest;