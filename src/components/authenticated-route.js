import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react/cjs/react.development"
import { CurrentUserContext } from "../context/current-user-context"

export default function AuthenticatedRoute() {
    const [userContext, _] = useContext(CurrentUserContext);
    if (!userContext.isLoggedIn) {
        return <Navigate replace to={"/login"} />
    }


    return (
        // for children add function AuthenticatedRoute({children})
        // if we want all the private route should have some common style or feature then
        // we can add div like <div classname="private-css">{children}</div>
        <div>
            <Outlet />
        </div>
    )

    // return userContext.isLoggedIn ? children : <Navigate replace to="/login" />;
}
