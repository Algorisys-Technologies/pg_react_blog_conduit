import { Link } from "react-router-dom";
import { useState } from "react";
import { useFetch } from "../hooks/use-fetch";
import BackendError from "../components/backend-error-messages";

export default function Register() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    //useFetch
    const [{ isLoading, response, error }, doFetch] = useFetch("/users");

    const handleSubmit = (e) => {
        e.preventDefault();
        // window.alert(JSON.stringify(user));

        doFetch({
            method: "POST",
            body: JSON.stringify({
                user: {
                    username: user.username,
                    email: user.email,
                    password: user.password
                }
            })
        });

    }

    return (
        <div className="container">
            <div className="mt-5 mb-2">
                <h1>Register</h1>
            </div>
            {isLoading && <h4>Loading...</h4>}
            {error && <BackendError errors={error} />}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control"
                        name="username" onChange={handleChange} value={user.username} />
                </div>
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