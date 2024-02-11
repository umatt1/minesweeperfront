import { Link } from "react-router-dom";
import './style.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-link">Play</Link>
            <Link to="/user" className="navbar-link">Profile / Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
        </nav>
    )
}

export default Navbar;
