import React, { useState } from 'react';
import PlayerApi from '../../apis/PlayerApi';
import { useCookies } from 'react-cookie';
import './style.css';

const api = new PlayerApi();

const FriendRequestForm = () => {
    const [formData, setFormData] = useState({
        username: ''
    });
    const [message, setMessage] = useState("");
    const [cookies] = useCookies(['jwt']); // Get the JWT token from cookies

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

            if (response.success) {
                setMessage(`Friend request to ${formData.username} sent successfully!`);
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
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Send Request</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default FriendRequestForm;
