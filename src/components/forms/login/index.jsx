import React, {useState} from 'react';
import AuthApi from '../../apis/AuthApi';
import { useCookies } from 'react-cookie';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import LogoutForm from '../logout';

const api = new AuthApi();

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [message, setMessage] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleLogout = async () => {
        removeCookie('jwt')
        removeCookie('username')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await api.login(formData);

        if (response.jwt) {
            setCookie("jwt", response.jwt)
            setCookie("username", response.user.username)
        } else {
            setMessage("Login failed!")
        }
    };
    
    return (
        <Container className="mt-4">
            {!cookies.jwt ? (
                <Card className="mx-auto" style={{ maxWidth: '400px' }}>
                    <Card.Body>
                        <Card.Title className="text-center mb-4">Login</Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit">
                                    Login
                                </Button>
                            </div>

                            {message && (
                                <Alert variant="danger" className="mt-3">
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

export default LoginForm;