import Tags from "../components/tags";
import { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../context/current-user-context";
import { useFetch } from "../hooks/use-fetch";
import { Link } from "react-router-dom";
// import { useLocation } from "react-router-dom";

export default function GlobalFeed({ data, onArticleDeleted, onToggleFavs }) {
    // const location = useLocation();
    // console.log("location:", location);

    const [currentUserState] = useContext(CurrentUserContext);

    const [favslug, setFavSlug] = useState({
        slug: undefined,
        isfav: false
    });

    const [{ response, error, isLoading }, doFetchToggleFavs] =
        useFetch(`articles/${favslug.slug}/favorite`);

    //favs effects
    useEffect(() => {
        if (!favslug.slug) return;
        doFetchToggleFavs({
            method: favslug.isfav ? "post" : "delete"
        })
    }, [favslug]);

    const handleDelete = (slug) => {
        const isDelete = window.confirm(`Are you sure you want to delete ${slug}?`);
        if (isDelete) {
            onArticleDeleted(slug);
        }
    }

    const isAuthor = (article) => {
        if (!currentUserState.currentUser) return false;
        if (currentUserState.isLoggedIn == null) return false;

        return (
            currentUserState.currentUser.username === article.author.username
        )
    }

    // var tagData = [];
    // if (!location.state) {
    //     tagData = data
    // } else {
    //     tagData = data.filter(datainfo => {
    //         return datainfo.tag_list.includes(location.state);
    //     })
    // }

    const toggleFavs = (slug, toggle) => {
        setFavSlug({
            slug: slug,
            isfav: !toggle
        });
        onToggleFavs && onToggleFavs(slug, !toggle);
    }

    return (
        <div className="animate__animated animate__rotateInDownLeft">
            {
                data.map(item => {
                    let favClass = item.favorited ? "favorited" : "not-favorited";

                    return (
                        <div className="post-item" key={item.slug}>
                            <Link to={`/article/${item.slug}`} >{item.title}</Link>
                            {
                                isAuthor(item) &&
                                <button className="float-end btn-danger"
                                    onClick={() => handleDelete(item.slug)}>
                                    &#x2716;
                                </button>
                            }

                            <div className="post-meta float-end">
                                <span className="post-author">
                                    -written by {item.author.username}
                                </span>
                                <span className={favClass}
                                    onClick={() => toggleFavs(item.slug, item.favorited)}>
                                    ♥
                                </span>
                                <span>
                                    {item.favorites_count}
                                </span>
                            </div>


                            <pre className="post-body">
                                {item.body}
                            </pre>
                            <footer className="tags">
                                <Tags item={item} />
                            </footer>
                        </div>
                    );
                })
            }
        </div >
    )
}