import { useContext, useEffect } from "react";
import { SYSTEM } from "../constants/systems";
import { CurrentUserContext } from "../context/current-user-context";
import { useFetch } from "../hooks/use-fetch";
import { useLocalStorage } from "../hooks/use-local-storage";

export default function UserLoader({ children }) {
    const [, setCurrentUserState] = useContext(CurrentUserContext);
    const [{ response }, doFetch] = useFetch(`user`);
    const [token] = useLocalStorage(SYSTEM.AUTH_TOKEN_KEY);

    useEffect(() => {
        if (!token) {
            setCurrentUserState(state => ({
                ...state,
                isLoggedIn: false
            }))
            return;
        }
        doFetch();
        setCurrentUserState(state => ({
            ...state,
            isLoading: true
        }));

    }, [token]);

    useEffect(() => {
        if (!response) {
            return
        };

        setCurrentUserState(state => ({
            ...state,
            isLoggedIn: true,
            isLoading: false,
            currentUser: response.user
        }));
    }, [response]);

    return children;
}