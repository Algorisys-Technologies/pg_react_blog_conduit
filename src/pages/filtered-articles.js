import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/use-fetch";
import GlobalFeed from "./global-feed";

export default function FilteredArticles({ onArticleDeleted, onToggleFavs }) {
    const { tag } = useParams();

    const [articles, setArticles] = useState([]);
    const [{ response: articleResponse, isLoading }, doArticleFetch]
        = useFetch(`articles?tag=${tag}`);

    useEffect(() => {
        doArticleFetch();
    }, [tag]);

    useEffect(() => {
        if (!articleResponse) return;
        setArticles(articleResponse.articles);
    }, [articleResponse]);

    // const onToggleFavs = (slug, status) => {
    //     let updated = articles.map(a => {
    //         if (a.slug == slug) {
    //             a.favorited = status;
    //             a.favorites_count = a.favorites_count + (status ? 1 : -1);
    //             return a;
    //         }
    //         return a;
    //     })

    //     setArticles([
    //         ...updated
    //     ])
    // }

    if (isLoading) {
        return <h2>Loading....</h2>
    }

    return (
        <>
            <h2>Filtered Articles for {tag}</h2>
            <GlobalFeed
                onArticleDeleted={onArticleDeleted}
                onToggleFavs={onToggleFavs}
                data={articles}
            />
        </>

    )
}