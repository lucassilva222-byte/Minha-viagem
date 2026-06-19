import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../contexts/GlobalContext'
import Navbar from '../components/Navbar'
import './CriarPost.css'

function CriarPost() {
    const { posts, setPosts, usuario } = useContext(GlobalContext)
    const [arquivos, setArquivos] = useState([])
    const [origem, setOrigem] = useState('')
    const [destino, setDestino] = useState('')
    const [valorGasto, setValorGasto] = useState('')
    const [tempoEstadia, setTempoEstadia] = useState('')
    const [legenda, setLegenda] = useState('')
    const navigate = useNavigate()

    function lidarComMidias(e) {
        const arquivosSelecionados = Array.from(e.target.files)
        
        if (arquivosSelecionados.length > 20) {
            alert("Você pode selecionar no máximo 20 arquivos (imagens ou vídeos).")
            e.target.value = ""
            return
        }

        setArquivos(arquivosSelecionados)
    }

    async function salvarPost(e) {
        e.preventDefault()
    
        // Mapeia os arquivos salvando o prefixo da pasta pública + o nome do arquivo
        const midiasFormatadas = arquivos.map(arquivo => ({
            url: `/imgs/${arquivo.name}`,
            tipo: arquivo.type.startsWith('video/') ? 'video' : 'imagem'
        }))

        const dadosPost = {
            autor: usuario || "Viajante Anônimo",
            origem: origem,
            destino: destino,
            valorGasto: valorGasto ? parseFloat(valorGasto.replace(/[^\d,.-]/g, '').replace(',', '.')) || null : null,
            tempoEstadia: tempoEstadia,
            legenda: legenda,
            midias: midiasFormatadas
        }
    
        try {
            const resposta = await fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosPost)
            })
    
            if (resposta.ok) {
                navigate('/')
            } else {
                alert("Erro ao publicar post no banco de dados.")
            }
        } catch (erro) {
            console.error("Erro na conexão:", erro)
        }
    }

    return (
        <div className="postar-container">
            <Navbar />
            <div className="postar-content">
                <h2>Compartilhe sua Rota</h2>
                <form onSubmit={salvarPost} className="postar-form">
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Local de Origem (Saindo de):</label>
                            <input 
                                type="text" 
                                placeholder="Ex: São Paulo - SP" 
                                value={origem}
                                onChange={(e) => setOrigem(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Local de Destino (Indo para):</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Paris - França" 
                                value={destino}
                                onChange={(e) => setDestino(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Valor Gasto Total (Opcional):</label>
                            <input 
                                type="text" 
                                placeholder="Ex: R$ 2.500,00" 
                                value={valorGasto}
                                onChange={(e) => setValorGasto(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tempo de Estadia (Opcional):</label>
                            <input 
                                type="text" 
                                placeholder="Ex: 7 dias / 2 semanas" 
                                value={tempoEstadia}
                                onChange={(e) => setTempoEstadia(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Fotos e Vídeos da Viagem (Máximo 20):</label>
                        <input 
                            type="file" 
                            accept="image/*,video/*" 
                            multiple
                            onChange={lidarComMidias}
                            required
                        />
                        {arquivos.length > 0 && (
                            <span className="midias-count">🔄 {arquivos.length} arquivo(s) selecionado(s)</span>
                        )}

                        
                        <div className="preview-galeria">
                            {arquivos.map((arquivo, index) => (
                                <div key={index} className="preview-item">
                                    {arquivo.type.startsWith('video/') ? (
                                        <video src={`/imgs/${arquivo.name}`} className="preview-media" muted />
                                    ) : (
                                        <img src={`/imgs/${arquivo.name}`} alt={arquivo.name} className="preview-media" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Relato da Viagem:</label>
                        <textarea 
                            placeholder="Como foi a experiência? Compartilhe dicas..." 
                            value={legenda}
                            onChange={(e) => setLegenda(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-postar">Publicar no Feed</button>
                </form>
            </div>
        </div>
    )
}

export default CriarPost
