import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import './Dashboard.css'

function Dashboard() {
    const [dados, setDados] = useState(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        async function buscarDadosDashboard() {
            try {
                const resposta = await fetch('http://localhost:3000/dashboard')
                const resultado = await resposta.json()
                setDados(resultado)
            } catch (erro) {
                console.error("Erro ao carregar dados do dashboard:", erro)
            } finally {
                setCarregando(false)
            }
        }
        buscarDadosDashboard()
    }, [])

    function formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor)
    }

    if (carregando) {
        return (
            <div className="dashboard-container">
                <Navbar />
                <div className="dashboard-content"><p className="dash-loading">Carregando estatísticas...</p></div>
            </div>
        )
    }

    if (!dados) {
        return (
            <div className="dashboard-container">
                <Navbar />
                <div className="dashboard-content"><p className="dash-loading">Não foi possível carregar as informações.</p></div>
            </div>
        )
    }

    // Calcula a maior quantidade de visitas nos destinos para fazer a proporção do gráfico de barras horizontais
    const maxVisitas = dados.topDestinos.length > 0 ? Math.max(...dados.topDestinos.map(d => parseInt(d.visitas))) : 1;
    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="dashboard-content">
                <h2>Dashboard da Comunidade</h2>
                
                {/* Cards Superiores */}
                <div className="dashboard-cards-grid">
                    <div className="dash-card">
                        <h3>Total de Posts</h3>
                        <p className="dash-card-number">{dados.totalPosts}</p>
                        <span>Viagens registradas</span>
                    </div>
                    <div className="dash-card">
                        <h3>Média de Gasto</h3>
                        <p className="dash-card-number text-sky">{formatarMoeda(dados.mediaGastoViagem)}</p>
                        <span>Por aventura cadastrada</span>
                    </div>
                    <div className="dash-card">
                        <h3>Movimentação Total</h3>
                        <p className="dash-card-number text-green">{formatarMoeda(dados.gastoTotalComunidade)}</p>
                        <span>Injetados no turismo</span>
                    </div>
                </div>

                {/* Seção de Gráficos e Rankings */}
                <div className="dashboard-charts-sections">
                    
                    {/* Gráfico de barras horizontais em CSS Puro para os Destinos */}
                    <div className="chart-box">
                        <h3>🔥 Top 5 Destinos Mais Visitados</h3>
                        <div className="bar-chart-container">
                            {dados.topDestinos.length === 0 ? (
                                <p className="no-data-msg">Nenhum dado disponível</p>
                            ) : (
                                dados.topDestinos.map((dest, i) => {
                                    const porcentagemLargura = (parseInt(dest.visitas) / maxVisitas) * 100;
                                    return (
                                        <div key={i} className="chart-row">
                                            <span className="chart-label">{dest.destino}</span>
                                            <div className="chart-bar-wrapper">
                                                <div className="chart-bar" style={{ width: `${porcentagemLargura}%` }}>
                                                    <span className="chart-bar-value">{dest.visitas}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Lista das Principais Origens */}
                    <div className="chart-box">
                        <h3>🛫 Principais Cidades de Origem</h3>
                        <ul className="origens-ranking-list">
                            {dados.topOrigens.length === 0 ? (
                                <p className="no-data-msg">Nenhum dado disponível</p>
                            ) : (
                                dados.topOrigens.map((orig, i) => (
                                    <li key={i} className="origem-list-item">
                                        <div className="origem-rank-badge">{i + 1}</div>
                                        <span className="origem-name">{orig.origem}</span>
                                        <span className="origem-count">{orig.quantidade} {parseInt(orig.quantidade) === 1 ? 'viajante' : 'viajantes'}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Dashboard