import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../contexts/GlobalContext'
import Navbar from '../components/Navbar'
import './Home.css'

function Home() {
    const { usuario } = useContext(GlobalContext)
    const navigate = useNavigate()

    return (
        <div className="home-container">
            <Navbar />
            
            <div className="home-content">
                {usuario && <p className="welcome-user">Olá, {usuario}!</p>}
                
                <h1>Descubra o seu próximo destino</h1>
                <p>Explore as praias mais paradisíacas e as cidades mais vibrantes com o MY TRAVEL.</p>
                
                <div className="home-actions">
                    <button 
                        className="btn-principal" 
                        onClick={() => navigate('/destinos')}>
                        Explorar Destinos
                    </button>
                    <button 
                        className="btn-secundario" 
                        onClick={() => navigate('/sobre')}>
                        Saiba Mais
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home