import { Link } from "react-router-dom";
import './style.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-link">Play</Link>
            <Link to="/user" className="navbar-link">User Stats</Link>
            <Link to="/about" className="navbar-link">About</Link>
        </nav>
    )
}

export default Navbar;
