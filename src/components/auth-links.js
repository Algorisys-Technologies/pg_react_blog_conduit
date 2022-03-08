import React from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react/cjs/react.development";
import { SYSTEM } from "../constants/systems";
import { CurrentUserContext } from "../context/current-user-context";
import { useLocalStorage } from "../hooks/use-local-storage";

export default function AuthLinks() {
    const [currentUserState, setCurrentUserState] = useContext(CurrentUserContext);
    const [token, setToken] = useLocalStorage(SYSTEM.AUTH_TOKEN_KEY);

    const handleSignout = (e) => {
        e.preventDefault();
        setToken("");
        setCurrentUserState(state => ({
            ...state,
            isLoggedIn: false,
            isLoading: false,
            currentUser: null
        }));
    }

    return (
        <React.Fragment>
            {!currentUserState.isLoggedIn &&
                <React.Fragment>
                    <li className="nav-item">
                        <NavLink to="/login" className="nav-link"
                            style={({ isActive }) => {
                                return { color: isActive ? "Yellow" : "white" }
                            }}
                        >
                            Sign in
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/register" className="nav-link"
                            style={({ isActive }) => {
                                return { color: isActive ? "Yellow" : "white" }
                            }}
                        >
                            Sign up
                        </NavLink>
                    </li>
                </React.Fragment>
            }
            {currentUserState.isLoggedIn &&
                <>
                    <li className="nav-item">
                        <NavLink to="/article/new" className="nav-link"
                            style={({ isActive }) => {
                                return { color: isActive ? "Yellow" : "white" }
                            }}
                        >
                            New Articles
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <a href="#" onClick={handleSignout} className="nav-link">
                            Signout {currentUserState.currentUser.username}
                        </a>
                    </li>
                </>
            }
        </React.Fragment>
    )
}