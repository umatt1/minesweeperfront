import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useCookies } from "react-cookie";
import { Navbar as BootstrapNavbar, Nav, Button, Container } from 'react-bootstrap';
import LoginForm from '../forms/login';
import RegisterForm from '../forms/register';

const Navbar = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);
    const [signIn, setSignIn] = useState(false);
    const [register, setRegister] = useState(false);

    function toggleSignIn() {
        setRegister(false);
        setSignIn(!signIn);
    }
    
    function toggleRegister() {
        setSignIn(false);
        setRegister(!register);
    }

    const handleLogout = () => {
        removeCookie('jwt')
        removeCookie('username')
        setSignIn(false);
        setRegister(false);
    }

    return (
        <>
            <BootstrapNavbar bg="light" expand="lg" className="mb-3">
                <Container>
                    <BootstrapNavbar.Brand onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                        Minesweeper
                    </BootstrapNavbar.Brand>
                    <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                    <BootstrapNavbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {!cookies.jwt && !cookies.username && (
                                <>
                                    <Button
                                        variant="outline-primary"
                                        className="me-2"
                                        onClick={toggleRegister}
                                    >
                                        Register
                                    </Button>
                                    <Button
                                        variant="outline-success"
                                        className="me-2"
                                        onClick={toggleSignIn}
                                    >
                                        Sign in
                                    </Button>
                                </>
                            )}
                            {cookies.jwt && cookies.username && (
                                <Button
                                    variant="outline-danger"
                                    className="me-2"
                                    onClick={handleLogout}
                                >
                                    Sign out
                                </Button>
                            )}
                            <Button
                                variant="primary"
                                onClick={() => navigate("/play")}
                            >
                                Play
                            </Button>
                        </Nav>
                    </BootstrapNavbar.Collapse>
                </Container>
            </BootstrapNavbar>

            {!cookies.jwt && (
                <Container>
                    {signIn && <LoginForm />}
                    {register && <RegisterForm />}
                </Container>
            )}
        </>
    );
}

export default Navbar;
