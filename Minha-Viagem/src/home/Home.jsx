import React from 'react'
import './Home.css'

function Home() {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Descubra o seu próximo destino</h1>
                <p>Explore as praias mais paradisíacas e as cidades mais vibrantes com o MY TRAVEL.</p>
                
                <div className="home-actions">
                    <button className="btn-principal">Explorar Destinos</button>
                    <button className="btn-secundario">Saiba Mais</button>
                </div>
            </div>
        </div>
    )
}

export default Home