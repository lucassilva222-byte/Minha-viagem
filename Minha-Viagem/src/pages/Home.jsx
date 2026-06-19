import { useContext, useState, useEffect } from 'react'
import { GlobalContext } from '../contexts/GlobalContext'
import Navbar from '../components/Navbar'
import './Home.css'

function Home() {
    const { posts, setPosts, usuario } = useContext(GlobalContext)
    const [comentarioInput, setComentarioInput] = useState({})
    
    const [idPostEditando, setIdPostEditando] = useState(null)
    const [valoresEditando, setValoresEditando] = useState({ 
        origem: '', 
        destino: '', 
        legenda: '',
        tempoEstadia: '',
        valorGasto: ''
    })

    useEffect(() => {
        async function carregarPostsDoBanco() {
            try {
                const resposta = await fetch('http://localhost:3000/posts')
                const dados = await resposta.json()
                setPosts(dados)
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
                return { ...post, comentarios: [...(post.comentarios || []), novoComentario] }
            }
            return post
        })
        setPosts(novosPosts)
        setComentarioInput({ ...comentarioInput, [id]: '' })
    }

    function numberToBRL(valor) {
        if (!valor) return '';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    }

    async function excluirPost(id) {
        const confirmar = window.confirm("Tem certeza que deseja excluir esta postagem?")
        if (!confirmar) return

        try {
            const resposta = await fetch(`http://localhost:3000/posts/${id}`, {
                method: 'DELETE'
            })
            if (resposta.ok) {
                setPosts(posts.filter((post) => post.id !== id))
            } else {
                alert("Erro ao excluir o post do banco de dados.")
            }
        } catch (erro) {
            console.error("Erro na exclusão:", erro)
        }
    }

    function iniciarEdicao(post) {
        setIdPostEditando(post.id)
        setValoresEditando({
            origem: post.origem,
            destino: post.destino,
            legenda: post.legenda,
            tempoEstadia: post.tempoEstadia || '',
            valorGasto: post.valorGasto || ''
        })
    }

    function cancelarEdicao() {
        setIdPostEditando(null)
        setValoresEditando({ origem: '', destino: '', legenda: '', tempoEstadia: '', valorGasto: '' })
    }

    async function salvarEdicao(id) {
        if (!valoresEditando.origem.trim() || !valoresEditando.destino.trim() || !valoresEditando.legenda.trim()) {
            alert("Os campos Origem, Destino e Relato são obrigatórios!")
            return
        }

        let valorTratado = valoresEditando.valorGasto
        if (typeof valorTratado === 'string') {
            const apenasNumeros = valorTratado.replace(/[^\d,.-]/g, '').replace(',', '.')
            valorTratado = apenasNumeros.trim() ? parseFloat(apenasNumeros) || null : null
        }

        const dadosAtualizados = {
            origem: valoresEditando.origem,
            destino: valoresEditando.destino,
            legenda: valoresEditando.legenda,
            tempoEstadia: valoresEditando.tempoEstadia || null,
            valorGasto: valorTratado
        }

        try {
            const resposta = await fetch(`http://localhost:3000/posts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados)
            })

            if (resposta.ok) {
                const postsAtualizados = posts.map(post => {
                    if (post.id === id) return { ...post, ...dadosAtualizados }
                    return post
                })
                setPosts(postsAtualizados)
                cancelarEdicao()
            } else {
                alert("Erro ao salvar as alterações no banco de dados.")
            }
        } catch (erro) {
            console.error("Erro na atualização:", erro)
            alert("Não foi possível conectar ao servidor.")
        }
    }



    return (
        <div className="home-container">
            <Navbar />
            <div className="feed-content">
                <h2>Feed de Viagens</h2>
                
                {posts.length === 0 ? (
                    <div className="no-posts-box">
                        <p className="no-posts">Nenhuma viagem compartilhada ainda.</p>
                        <p className="no-posts-sub">Seja o primeiro a contar sua aventura!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="post-card">
                            
                            <div className="post-actions-container">
                                {idPostEditando !== post.id && (
                                    <button onClick={() => iniciarEdicao(post)} className="btn-acao btn-editar" title="Editar">✏️</button>
                                )}
                                <button onClick={() => excluirPost(post.id)} className="btn-acao btn-excluir" title="Excluir">🗑️</button>
                            </div>

                            <div className="post-header">
                                <span className="post-author">@{post.autor}</span>
                                
                                {idPostEditando === post.id ? (
                                    <div className="post-route-edit">
                                        <input type="text" value={valoresEditando.origem} onChange={(e) => setValoresEditando({ ...valoresEditando, origem: e.target.value })} placeholder="Origem" />
                                        <span className="route-arrow">➔</span>
                                        <input type="text" value={valoresEditando.destino} onChange={(e) => setValoresEditando({ ...valoresEditando, destino: e.target.value })} placeholder="Destino" />
                                    </div>
                                ) : (
                                    <div className="post-route">
                                        <span className="route-origin">🛫 {post.origem}</span>
                                        <span className="route-arrow">➔</span>
                                        <span className="route-destination">🛬 {post.destino}</span>
                                    </div>
                                )}
                            </div>

                            {idPostEditando === post.id ? (
                                <div className="post-details-badge-edit" style={{ display: 'flex', gap: '10px', margin: '10px 15px', justifyContent: 'space-around' }}>
                                    <input 
                                        type="text" 
                                        style={{ background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', width: '45%' }}
                                        value={valoresEditando.tempoEstadia} 
                                        onChange={(e) => setValoresEditando({ ...valoresEditando, tempoEstadia: e.target.value })} 
                                        placeholder="⏱️ Ex: 5 dias"
                                    />
                                    <input 
                                        type="text" 
                                        style={{ background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', width: '45%' }}
                                        value={valoresEditando.valorGasto} 
                                        onChange={(e) => setValoresEditando({ ...valoresEditando, valorGasto: e.target.value })} 
                                        placeholder="💰 Ex: 1500"
                                    />
                                </div>
                            ) : (
                                (post.tempoEstadia || post.valorGasto) && (
                                    <div className="post-details-badge">
                                        {post.tempoEstadia && <span>⏱️ <strong>Duração:</strong> {post.tempoEstadia}</span>}
                                        {post.valorGasto && <span>💰 <strong>Investimento:</strong> {numberToBRL(post.valorGasto)}</span>}
                                    </div>
                                )
                            )}
                            
                            {post.midias && post.midias.length > 0 && (
                                <div className="post-media-gallery">
                                    {post.midias.map((midia, index) => (
                                        midia.tipo === 'video' ? (
                                            <video key={index} src={midia.url} controls className="post-media-item" />
                                        ) : (
                                            <img key={index} src={midia.url} alt="Mídia" className="post-media-item" />
                                        )
                                    ))}
                                </div>
                            )}
                            
                            <div className="post-body">
                                {idPostEditando === post.id ? (
                                    <div className="post-caption-edit-box">
                                        <textarea className="input-legenda-edit" value={valoresEditando.legenda} onChange={(e) => setValoresEditando({ ...valoresEditando, legenda: e.target.value })} placeholder="Edite seu relato..." />
                                        <div className="edit-box-buttons">
                                            <button className="btn-salvar-edit" onClick={() => salvarEdicao(post.id)}>Salvar</button>
                                            <button className="btn-cancelar-edit" onClick={cancelarEdicao}>Cancelar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="post-caption"><strong>@{post.autor}:</strong> {post.legenda}</p>
                                )}

                                <div className="post-comments-section">
                                    {(post.comentarios || []).map(com => (
                                        <p key={com.id} className="comment-item"><strong>@{com.autor}:</strong> {com.texto}</p>
                                    ))}
                                </div>

                                <form onSubmit={(e) => lidarComentario(e, post.id)} className="comment-form">
                                    <input type="text" placeholder="Adicione um comentário..." value={comentarioInput[post.id] || ''} onChange={(e) => setComentarioInput({ ...comentarioInput, [post.id]: e.target.value })} />
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