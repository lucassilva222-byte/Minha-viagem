import { createBrowserRouter } from "react-router-dom"; 
import Home from "../pages/Home";
import CriarPost from "../pages/CriarPost";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/postar", element: <CriarPost /> }
]);

export default router;
