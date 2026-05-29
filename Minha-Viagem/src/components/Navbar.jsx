import { Link } from "react-router-dom"
import './Navbar.css'
function Navbar() {
  return (
    <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/cadastro">Cadastro</Link>
        <Link to="/login">Login</Link>
        <Link to="/emalta">Em Alta</Link>
    </nav>
  )
}

export default Navbar
