import React, {useState} from 'react';
import AuthApi from '../../apis/AuthApi';
import { useCookies } from 'react-cookie';
import './style.css';
import LogoutForm from '../logout';

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

        const response = await api.login(formData);

        if (response.jwt) {
            // store retrieved token in a cookie
            setCookie("jwt", response.jwt)
            setCookie("username", response.user.username)
            // redirect to next page
        } else {
            setMessage("Login failed!")
        }

    };
    
    return (<>
        {!cookies.jwt && <form onSubmit={handleSubmit} className='loginForm'>
            <h3>Login</h3>
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
            <LogoutForm/>
            </div>}
        </>
    );
}

export default LoginForm;