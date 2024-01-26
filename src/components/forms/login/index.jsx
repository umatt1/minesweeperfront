import React, {useState} from 'react'
import PlayerApi from '../../apis/PlayerApi';
import './style.css'

const LoginForm = ({}) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // TODO: Send login request to the Spring Boot backend
        // Use formData.username and formData.password

        // Example using fetch:
        // const response = await fetch('/api/auth/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData),
        // });

        //const response = await PlayerApi

        // TODO: Handle response, store token, and navigate to the next page
        // Example:
        // if (response.ok) {
        //     const data = await response.json();
        //     // Store token in a secure way (localStorage, cookies, etc.)
        //     // Redirect to the next page
        //     history.push('/dashboard');
        // } else {
        //     // Handle login failure
        // }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Password:
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </label>
            <br />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;