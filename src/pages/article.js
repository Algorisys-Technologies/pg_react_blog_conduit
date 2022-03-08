import { useState } from "react";
import { Link, useParams } from "react-router-dom"
import { useEffect } from "react/cjs/react.development"
import { useFetch } from "../hooks/use-fetch";

export default function Article() {
    const { slug } = useParams();

    const [articles, setArticles] = useState([]);
    const [{ response: articleResponse, isLoading }, doArticleFetch]
        = useFetch(`articles/${slug}`);

    useEffect(() => {
        doArticleFetch();
    }, [slug])

    console.log(articleResponse?.article)

    useEffect(() => {
        if (!articleResponse) return;
        setArticles(articleResponse.article);
    }, [articleResponse]);

    const dStyle = {
        margin:"10px",
        border:"1px solid skyblue",
        padding:"10px"
    }

    return (
        <div>
            <div className="animate__animated animate__rotateInDownLeft" style={dStyle}>
                <h3>{articles.title}</h3>
                <h4>{articles.description}</h4>
                <h6>{articles.body}</h6>
                <Link to={"/"} >back</Link> | {" "}
                <Link to={`/article/${slug}/edit`} >edit</Link>
            </div>
        </div>

    )
}