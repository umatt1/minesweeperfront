import React, {useState} from 'react';
import AuthApi from '../../apis/AuthApi';
import { useCookies } from 'react-cookie';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import LogoutForm from '../logout';

const api = new AuthApi();

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("danger");
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
            setMessageType("danger");
            return;
        }

        try {
            const response = await api.register(formData);
            setMessage("Registration for " + response.username + " successful! Logging you in...");
            setMessageType("success");

            const loginResponse = await api.login(formData);

            if (loginResponse.jwt) {
                setCookie("jwt", loginResponse.jwt);
                setCookie("username", loginResponse.user.username);
            } else {
                setMessage("Login failed after registration!");
                setMessageType("danger");
            }
        } catch (error) {
            setMessage("Registration failed!");
            setMessageType("danger");
        }
    };
    
    return (
        <Container className="mt-4">
            {!cookies.jwt ? (
                <Card className="mx-auto" style={{ maxWidth: '400px' }}>
                    <Card.Body>
                        <Card.Title className="text-center mb-4">Register</Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Choose a password"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formConfirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Retype your password"
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit">
                                    Register
                                </Button>
                            </div>

                            {message && (
                                <Alert variant={messageType} className="mt-3">
                                    {message}
                                </Alert>
                            )}
                        </Form>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="mx-auto" style={{ maxWidth: '400px' }}>
                    <Card.Body>
                        <Card.Text className="text-center mb-3">
                            Welcome, {cookies.username}!
                        </Card.Text>
                        <LogoutForm />
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default RegisterForm;