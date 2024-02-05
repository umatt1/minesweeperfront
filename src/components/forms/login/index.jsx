import React, {useState} from 'react';
import AuthApi from '../../apis/AuthApi';
import { useCookies } from 'react-cookie';
import './style.css';

const api = new AuthApi();

const LoginForm = ({}) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [message, setMessage] = useState("")
    const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleLogout = async (e) => {
        removeCookie('jwt')
        removeCookie('username')
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

        const response = await api.login(formData);

        if (response.jwt) {
            // store retrieved token in a cookie
            setCookie("jwt", response.jwt)
            setCookie("username", response.user.username)
            // redirect to next page
        } else {
            setMessage("Login failed!")
        }

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
    
    return (<>
        {!cookies.jwt && <form onSubmit={handleSubmit}>
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
            {message != "" && <p>{message}</p>}
        </form>}
        {cookies.jwt && <div>
            <p>{"Welcome, "+ cookies.username} </p>
            <form onSubmit={handleLogout}>
            <button type="submit">Sign out</button>
            </form>
            </div>}
        </>
    );
}

export default LoginForm;