import React, { useState } from 'react';
import PlayerApi from '../../apis/PlayerApi';
import { useCookies } from 'react-cookie';
import './style.css';

const api = new PlayerApi();

const FriendRequestForm = () => {
    const [cookies] = useCookies(['jwt, username']); // Get the JWT token from cookies
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        requester: cookies.username,
        requested: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Making the friend request using the PlayerApi with JWT token from cookies
            const response = await api.requestFriend(formData, cookies.jwt);
            if (toString(response.requester) === toString(formData.requester) && toString(response.requested) === toString(formData.requested)) {
                setMessage(`Friend request to ${formData.requester} sent successfully!`);
            } else {
                setMessage("Friend request failed!");
            }

        } catch (error) {
            console.error(error);
            setMessage("An error occurred while sending the friend request.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className='requestFriendForm'>
            <h3>Request Friend</h3>
            <label>
                Friend's Username:
                <input
                    type="text"
                    name="requested"
                    value={formData.requested}
                    onChange={handleChange}
                />
                <input
                    type="hidden"
                    name="requester"
                    value={cookies.username}
                />
            </label>
            <button type="submit">Send Request</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default FriendRequestForm;
