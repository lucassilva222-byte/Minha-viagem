const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mytravel',
    password: 'senai',
    port: 5433,
});

app.use(cors());
app.use(express.json());

app.get('/posts', async (req, res) => {
    try {
        const postsResult = await pool.query('SELECT * FROM posts ORDER BY id DESC');
        const posts = postsResult.rows;

        const postsFormatados = await Promise.all(posts.map(async (p) => {
            const midiasResult = await pool.query('SELECT nome_arquivo AS url, tipo FROM post_midias WHERE post_id = $1', [p.id]);
            
            return {
                id: p.id,
                autor: p.autor,
                origem: p.origem,
                destino: p.destino,
                valorGasto: p.valor_gasto,
                tempoEstadia: p.tempo_estadia,
                legenda: p.legenda,
                midias: midiasResult.rows, 
                comentarios: []
            };
        }));

        res.json(postsFormatados);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar posts' });
    }
});

app.patch('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { origem, destino, legenda, tempoEstadia, valorGasto } = req.body;
    
    try {
        const postResult = await pool.query(
            `UPDATE posts 
             SET origem = $1, destino = $2, legenda = $3, tempo_estadia = $4, valor_gasto = $5 
             WHERE id = $6 RETURNING *`,
            [origem, destino, legenda, tempoEstadia, valorGasto, id]
        );
        
        if (postResult.rows.length === 0) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        const p = postResult.rows[0];
        const midiasResult = await pool.query('SELECT nome_arquivo AS url, tipo FROM post_midias WHERE post_id = $1', [p.id]);

        res.json({
            id: p.id,
            autor: p.autor,
            origem: p.origem,
            destino: p.destino,
            valorGasto: p.valor_gasto,
            tempoEstadia: p.tempo_estadia,
            legenda: p.legenda,
            midias: midiasResult.rows,
            comentarios: []
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao atualizar post parcialmente' });
    }
});

app.post('/posts', async (req, res) => {
    const { autor, origem, destino, valorGasto, tempoEstadia, legenda, midias } = req.body;
    try {
        const postResult = await pool.query(
            'INSERT INTO posts (autor, origem, destino, valor_gasto, tempo_estadia, legenda) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [autor, origem, destino, valorGasto, tempoEstadia, legenda]
        );
        
        const novoPost = postResult.rows[0];
        let midiasInseridas = [];

        if (midias && Array.isArray(midias)) {
            for (const midia of midias) {
                const midiaResult = await pool.query(
                    'INSERT INTO post_midias (post_id, nome_arquivo, tipo) VALUES ($1, $2, $3) RETURNING nome_arquivo AS url, tipo',
                    [novoPost.id, midia.url, midia.tipo]
                );
                midiasInseridas.push(midiaResult.rows[0]);
            }
        }

        res.status(201).json({
            id: novoPost.id,
            autor: novoPost.autor,
            origem: novoPost.origem,
            destino: novoPost.destino,
            valorGasto: novoPost.valor_gasto,
            tempoEstadia: novoPost.tempo_estadia,
            legenda: novoPost.legenda,
            midias: midiasInseridas,
            comentarios: []
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar post' });
    }
});

app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { autor, origem, destino, valorGasto, tempoEstadia, legenda, midias } = req.body;
    try {
        const postResult = await pool.query(
            'UPDATE posts SET autor = $1, origem = $2, destino = $3, valor_gasto = $4, tempo_estadia = $5, legenda = $6 WHERE id = $7 RETURNING *',
            [autor, origem, destino, valorGasto, tempoEstadia, legenda, id]
        );
        
        if (postResult.rows.length === 0) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        const postAtualizado = postResult.rows[0];

        await pool.query('DELETE FROM post_midias WHERE post_id = $1', [id]);
        let midiasInseridas = [];

        if (midias && Array.isArray(midias)) {
            for (const midia of midias) {
                const midiaResult = await pool.query(
                    'INSERT INTO post_midias (post_id, nome_arquivo, tipo) VALUES ($1, $2, $3) RETURNING nome_arquivo AS url, tipo',
                    [id, midia.url, midia.tipo]
                );
                midiasInseridas.push(midiaResult.rows[0]);
            }
        }

        res.json({
            id: postAtualizado.id,
            autor: postAtualizado.autor,
            origem: postAtualizado.origem,
            destino: postAtualizado.destino,
            valorGasto: postAtualizado.valor_gasto,
            tempoEstadia: postAtualizado.tempo_estadia,
            legenda: postAtualizado.legenda,
            midias: midiasInseridas,
            comentarios: []
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao atualizar post' });
    }
});

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        res.json({ message: 'Post deletado com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao deletar post' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

app.get('/dashboard', async (req, res) => {
    try {
        // 1. Total de posts cadastrados
        const totalPostsRes = await pool.query('SELECT COUNT(*) AS total FROM posts');
        const totalPosts = parseInt(totalPostsRes.rows[0].total, 10);

        // 2. Gasto total da comunidade e Média de gasto por viagem
        const gastosRes = await pool.query('SELECT SUM(valor_gasto) AS total_gasto, AVG(valor_gasto) AS media_gasto FROM posts');
        const gastoTotalComunidade = parseFloat(gastosRes.rows[0].total_gasto) || 0;
        const mediaGastoViagem = parseFloat(gastosRes.rows[0].media_gasto) || 0;

        // 3. Top 5 Destinos mais visitados (agrupados por ocorrência)
        const topDestinosRes = await pool.query(`
            SELECT destino, COUNT(*) AS visitas 
            FROM posts 
            WHERE destino IS NOT NULL AND destino != ''
            GROUP BY destino 
            ORDER BY visitas DESC, destino ASC
            LIMIT 5
        `);

        // 4. Principais Cidades de Origem
        const topOrigensRes = await pool.query(`
            SELECT origem, COUNT(*) AS quantidade 
            FROM posts 
            WHERE origem IS NOT NULL AND origem != ''
            GROUP BY origem 
            ORDER BY quantidade DESC, origem ASC
            LIMIT 5
        `);

        res.json({
            totalPosts,
            mediaGastoViagem,
            gastoTotalComunidade,
            topDestinos: topDestinosRes.rows,
            topOrigens: topOrigensRes.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao compilar dados do dashboard' });
    }
});
