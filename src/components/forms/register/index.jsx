import React, {useState} from 'react';
import AuthApi from '../../apis/AuthApi';
import { useCookies } from 'react-cookie';
import './style.css';
import LogoutForm from '../logout';

const api = new AuthApi();

const RegisterForm = ({}) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState("")
    const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords not matching");
            return;
        }

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
        {!cookies.jwt && <form onSubmit={handleSubmit} className='registerForm'>
            <h3>Register</h3>
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
            <label>
                Retype password:
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
            </label>
            <br></br>
            <button type="submit">Register</button>
            {message != "" && <p>{message}</p>}
        </form>}
        {cookies.jwt && <div>
            <p>{"Welcome, "+ cookies.username} </p>
            <LogoutForm/>
            </div>}
        </>
    );
}

export default RegisterForm;