import { useNavigate } from "react-router-dom";

export default function Tag({ tag }) {
    const navigate = useNavigate();

    return (
        <span className="tag" onClick={() => {
            navigate(`/articles/${tag}`)
        }}>
            {tag}
        </span>
    );
}