import { Link, Navigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useFetch } from "../hooks/use-fetch";
import BackendError from "../components/backend-error-messages";
import { SYSTEM } from "../constants/systems";
import { useLocalStorage } from "../hooks/use-local-storage";
import { CurrentUserContext } from "../context/current-user-context";

export default function Login() {
    // const API = "https://conduit.productionready.io/api";

    const [currentUserState, setCurrentUserState] = useContext(CurrentUserContext);

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [token, setToken] = useLocalStorage(SYSTEM.AUTH_TOKEN_KEY);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const [{ isLoading, response, error }, doFetch] = useFetch("/users/login");

    // When user logins in
    useEffect(() => {
        if (!response) return;
        if (!response.user) return;

        // Set the auth token in localStorage
        setToken(response.user.token);

        // update the user context
        setCurrentUserState(state => ({
            ...state,
            isLoggedIn: true,
            isLoading: false,
            currentUser: response.user
        }))

    }, [response])

    const handleSubmit = (e) => {
        e.preventDefault();
        // alert(JSON.stringify(user));

        doFetch({
            method: "POST",
            body: JSON.stringify({
                user: {
                    email: user.email,
                    password: user.password
                }
            })
        });

        // fetch(`${API}/users/login`, {
        //     method: 'post',
        //     body: JSON.stringify({
        //         user: {
        //             email: user.email,
        //             password: user.password
        //         }
        //     }),
        //     headers: {
        //         "Content-type": "application/json; charset=UTF-8"
        //     }
        // })
        //     .then(res => res.json())
        //     .then(json => {
        //         console.log(json)
        //     })
    }

    if (currentUserState.isLoggedIn) {
        return <Navigate replace to={"/"} />
    }

    return (
        <div className="container">
            <div className="mt-5 mb-2">
                <h1>Login</h1>
                <Link to="/register">Need an account?</Link>
            </div>
            {isLoading && <h4>Loading...</h4>}
            {error && <BackendError errors={error} />}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input type="email" className="form-control"
                        name="email" onChange={handleChange} value={user.email} />
                    <div className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control"
                        name="password" onChange={handleChange} value={user.password} />
                </div>
                <button type="submit" className="btn btn-lg btn-primary float-sm-start">Sign in</button>
            </form>
        </div>
    )
}