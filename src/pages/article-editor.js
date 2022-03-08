import { useEffect, useState } from "react";
import { useFetch } from "../hooks/use-fetch";
import { useNavigate, useParams } from "react-router-dom";
import InputTag from "../components/inputtag/input-tag";

export default function ArticleEditor({ onCreated, onUpdated }) {
    const navigate = useNavigate();

    const [article, setArticle] = useState({
        title: "",
        description: "",
        body: "",
        tagList: [],
        tags: ""
    });

    //for editing
    let { slug } = useParams();

    //post the article for create new article
    const [{ isLoading, response, error }, doFetch] = useFetch("articles");

    // Fetch article for edit
    const [{ isLoading: isLoadingEdit, response: articleResponse, error: errorFetchEdit }, doArticleFetch]
        = useFetch(`articles/${slug}`);

    //Update article - PUT /api/articles/:slug
    const [{ isLoading: isLoadingUpdate, response: articleUpdateResponse, error: errorUpdate }, doArticleUpdate]
        = useFetch(`articles/${slug}`);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!slug) createArticle();
        else updateArticle();
    }

    const createArticle = () => {
        doFetch({
            method: "post",
            body: JSON.stringify({
                article: {
                    title: article.title,
                    body: article.body,
                    description: article.description,
                    tagList: article.tags.split(",")
                }
            })
        })
    }

    // api call for update
    const updateArticle = () => {
        doArticleUpdate({
            method: "put",
            body: JSON.stringify({
                article: {
                    title: article.title,
                    body: article.body,
                    description: article.description,
                    tagList: article.tags.split(",")
                }
            })
        })
    }

    // edit 
    useEffect(() => {
        if (!slug) return;
        doArticleFetch();
    }, [slug])

    //article fetched for edit
    useEffect(() => {
        if (!articleResponse?.article) return;
        setArticle({
            ...article,
            title: articleResponse.article.title,
            description: articleResponse.article.description,
            body: articleResponse.article.body,
            tags: articleResponse.article.tag_list.join(",")
        })
    }, [articleResponse])

    // new article
    useEffect(() => {
        if (!response) return;
        if (!response.article) return;

        //to connect to the parent and send the data as dyanamic event
        onCreated(response.article);

        // edirect to Home Page(GlobalFeed page) 
        navigate("/");

        //reset the state
        setArticle({
            title: "",
            description: "",
            body: "",
            tags: "",
            tagList: []
        })
    }, [response])

    useEffect(() => {
        if (!articleUpdateResponse) return;
        if (!articleUpdateResponse.article) return;

        onUpdated(articleUpdateResponse.article);
        //reset state
        setArticle({
            title: "",
            description: "",
            body: "",
            tags: "",
            tagList: []
        });

        // redirect to Home Page(GlobalFeed page) 
        navigate("/");
    }, [articleUpdateResponse])

    const handleChange = (e) => {
        e.preventDefault();
        setArticle({
            ...article,
            [e.target.name]: e.target.value
        })
    }

    const onAddTag = (tag) => {
        setArticle({
            ...article,
            tags: article.tags + "," + tag
        })
    }

    const onDeleteTag = (tag) => {
        //tags are string
        let remainingTags = article.tags;
        remainingTags = article.tags.split(",").filter(t => {
            return t != tag;
        })

        remainingTags = remainingTags.join(",");
        setArticle({
            ...article,
            tags: remainingTags
        })
    }

    return (
        <div className="card border-0 shadow animate__animated animate__rotateIn">
            <div className="card-header">
                ARTICLE EDITOR {slug ? "(edit)" : "(new)"}
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input className="form-control" type="text"
                            placeholder="Enter article title"
                            name="title" value={article.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <input className="form-control" type="text"
                            placeholder="Enter article description"
                            name="description" value={article.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <textarea className="form-control" type="text"
                            placeholder="Enter content" rows="10" cols="50"
                            name="body" value={article.body}
                            onChange={handleChange}
                            style={
                                {
                                    height: "80vh",
                                    width: "100%"
                                }
                            }
                        />
                    </div>

                    <div className="mb-3">
                    <InputTag
                        onAddTag={onAddTag}
                        onDeleteTag={onDeleteTag}
                        defaultTags={article.tags}
                        placeholder="Enter tags separated by comma"
                    />
                    </div>

                    <button className="btn btn-primary">
                        SUBMIT
                    </button>
                </form>
            </div>
        </div>
    )
}