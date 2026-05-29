import { createBrowserRouter } from "react-router-dom"; 
import Home from "../pages/Home";
import CadastroUsuario from "../pages/CadastroUsuario";
import Login from "../pages/LoginViagem";
import EmAlta from "../pages/EmAlta";

const router = createBrowserRouter([
    { path: "/", element: <Home />},
    { path: "/cadastro", element: <CadastroUsuario />},
    { path: "/login", element: <Login />},
    { path: "/emalta", element: <EmAlta />}
]);

export default router;
