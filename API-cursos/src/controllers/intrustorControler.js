const { conectarBanco } = require('../config/dbConnect');

async function listarInstrutores(req, res) {
  try {
    const pool = await conectarBanco();
    const resultado = await pool.request().query('SELECT * FROM dbCursos.Instrutores');
    res.json(resultado.recordset);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar instrutores' });
  }
}

module.exports = { listarInstrutores };