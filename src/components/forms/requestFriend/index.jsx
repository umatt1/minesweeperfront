import React, {useState} from 'react';
import AuthApi from '../../apis/AuthApi';
import { useCookies } from 'react-cookie';
import './style.css';
import LogoutForm from '../logout';

const api = new AuthApi();

const FriendRequestForm = ({}) => {
    const [formData, setFormData] = useState({
        username: ''
    });
    const [message, setMessage] = useState("")

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.register(formData);
            setMessage("Registration for " + response.username + " successful! Login with the new code");

            const loginResponse = await api.login(formData);

            if (loginResponse.jwt) {
                // store retrieved token in a cookie
                setCookie("jwt", loginResponse.jwt)
                setCookie("username", loginResponse.user.username)
                // redirect to next page
            } else {
                setMessage("Login failed!")
            }


        } catch (error) {
            setMessage("Registration failed!");
        }

    };
    
    return (<>
        <form onSubmit={handleSubmit} className='requestFriendForm'>
            <label>
                Request:
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Submit</button>
            {message != "" && <p>{message}</p>}
        </form>
        </>
    );
}

export default FriendRequestForm;