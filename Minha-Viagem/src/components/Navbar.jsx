import { Link } from "react-router-dom"
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MY TRAVEL</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-item">Linha do Tempo</Link>
        <Link to="/postar" className="nav-item btn-login">Nova Postagem</Link>
      </div>
    </nav>
  )
}

export default Navbar
