import { useContext, useState, useEffect } from 'react'
import { GlobalContext } from '../contexts/GlobalContext'
import Navbar from '../components/Navbar'
import './Home.css'

function Home() {
    const { posts, setPosts, usuario } = useContext(GlobalContext)
    const [comentarioInput, setComentarioInput] = useState({})

    useEffect(() => {
        async function carregarPostsDoBanco() {
            try {
               
                const resposta = await fetch('http://localhost:3000/posts')
                const dados = await resposta.json()
                
               
                const postsFormatados = dados.map(p => ({
                    id: p.id,
                    autor: p.autor,
                    origem: p.origem,
                    destino: p.destino,
                    valorGasto: p.valor_gasto, 
                    tempoEstadia: p.tempo_estadia, 
                    legenda: p.legenda,
                   
                    midias: p.midias ? p.midias.map(url => ({
                        url: url,
                        tipo: url.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'imagem'
                    })) : [],
                    comentarios: [] 
                }))

                
                setPosts(postsFormatados)
            } catch (erro) {
                console.error("Erro ao carregar feed do banco de dados:", erro)
            }
        }
        
        carregarPostsDoBanco()
    }, [setPosts])

    function lidarComentario(e, id) {
        e.preventDefault()
        const textoComentario = comentarioInput[id]
        if (!textoComentario) return

        const novosPosts = posts.map(post => {
            if (post.id === id) {
                const novoComentario = {
                    id: Date.now(),
                    autor: usuario || "Viajante",
                    texto: textoComentario
                }
                return { ...post, comentarios: [...post.comentarios, novoComentario] }
            }
            return post
        })

        setPosts(novosPosts)
        setComentarioInput({ ...comentarioInput, [id]: '' })
    }

    return (
        <div className="home-container">
            <Navbar />
            <div className="feed-content">
                <h2>Linha do Tempo de Viagens</h2>
                
                {posts.length === 0 ? (
                    <div className="no-posts-box">
                        <p className="no-posts">Nenhuma viagem compartilhada ainda.</p>
                        <p className="no-posts-sub">Seja o primeiro a contar sua aventura!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="post-card">
                            <div className="post-header">
                                <span className="post-author">@{post.autor}</span>
                                <div className="post-route">
                                    <span className="route-origin">🛫 {post.origem}</span>
                                    <span className="route-arrow">➔</span>
                                    <span className="route-destination">🛬 {post.destino}</span>
                                </div>
                            </div>

                            {(post.valorGasto || post.tempoEstadia) && (
                                <div className="post-details-badge">
                                    {post.tempoEstadia && <span>⏱️ <strong>Duração:</strong> {post.tempoEstadia}</span>}
                                    {post.valorGasto && <span>💰 <strong>Investimento:</strong> {post.valorGasto}</span>}
                                </div>
                            )}
                            
                            <div className="post-media-gallery">
                                {post.midias && post.midias.map((midia, index) => (
                                    midia.tipo === 'video' ? (
                                        <video key={index} src={midia.url} controls className="post-media-item" />
                                    ) : (
                                        <img key={index} src={midia.url} alt={`Anexo ${index + 1}`} className="post-media-item" />
                                    )
                                ))}
                            </div>
                            
                            <div className="post-body">
                                <p className="post-caption"><strong>@{post.autor}:</strong> {post.legenda}</p>

                                <div className="post-comments-section">
                                    {post.comentarios.map(com => (
                                        <p key={com.id} className="comment-item">
                                            <strong>@{com.autor}:</strong> {com.texto}
                                        </p>
                                    ))}
                                </div>

                                <form onSubmit={(e) => lidarComentario(e, post.id)} className="comment-form">
                                    <input 
                                        type="text" 
                                        placeholder="Adicione um comentário..."
                                        value={comentarioInput[post.id] || ''}
                                        onChange={(e) => setComentarioInput({
                                            ...comentarioInput,
                                            [post.id]: e.target.value
                                        })}
                                    />
                                    <button type="submit">Enviar</button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Home
