import { Link, NavLink } from "react-router-dom"
import AuthLinks from "./auth-links"

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    BLOG
                </Link>
                <ul className="nav navbar-nav pull-xs-right">
                    <li className="nav-item">
                        <NavLink to="/" className="nav-link"
                            style={({ isActive }) => {
                                return { color: isActive ? "Yellow" : "white" }
                            }}
                        >
                            Home
                        </NavLink>
                    </li>
                    <AuthLinks />
                </ul>
            </div>
        </nav>
    )
}