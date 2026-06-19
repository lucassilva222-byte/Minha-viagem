import { createBrowserRouter } from "react-router-dom"; 
import Home from "../pages/Home";
import CriarPost from "../pages/CriarPost";
import Dashboard from "../pages/Dashboard"; 

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/postar", element: <CriarPost /> },
    { path: "/dashboard", element: <Dashboard /> } 
]);

export default router;