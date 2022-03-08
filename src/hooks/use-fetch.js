import { useCallback, useEffect, useState } from "react";
import { API_BASE, SYSTEM } from "../constants/systems";
import { useLocalStorage } from "./use-local-storage";

export function useFetch(url) {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [options, setOptions] = useState({});

    const [token] = useLocalStorage(SYSTEM.AUTH_TOKEN_KEY);


    const doFetch = useCallback((options = {}) => {
        setOptions(options);
        setIsLoading(true);
    }, []);

    // Make fetch api call here
    useEffect(() => {
        if (!isLoading) return;

        //fetch the data
        fetch(`${API_BASE}/${url}`, {
            ...options,
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTf-8",
                "Access-Control-Allow-Origin": "*",
                "Authorization": token ? `Token ${token}` : ''
            }
        }).then(res => {
            return res.json()
        })
            .then(json => {
                setIsLoading(false);

                if (json.errors) {
                    setError(json.errors);
                    return;
                }

                setResponse(json);
            }).catch(e => {
                setError({
                    "Server side error": [e.message]
                });
                setIsLoading(false);
            })
    }, [isLoading, url, options])


    return [
        {
            isLoading: isLoading,
            response: response,
            error: error
        }, doFetch
    ]

}