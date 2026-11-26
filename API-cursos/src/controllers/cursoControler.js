const { sql, conectarBanco } = require('../config/dbConnect');

// 2. GET /api/cursos (traz o nome do instrutor junto com INNER JOIN para a tabela)
async function listarCursos(req, res) {
  try {
    const pool = await conectarBanco();
    const resultado = await pool.request().query(`
      SELECT c.*, i.nome AS instrutor_nome
      FROM dbCursos.Cursos c
      INNER JOIN dbCursos.Instrutores i ON c.instrutor_id = i.id
    `);
    res.json(resultado.recordset);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar cursos' });
  }
}

// puxa o curso
async function buscarCursoPorId(req, res) {
  try {
    const { id } = req.params;
    const pool = await conectarBanco();
    const resultado = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM dbCursos.Cursos WHERE id = @id');

    if (resultado.recordset.length === 0) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }

    res.json(resultado.recordset[0]);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar curso' });
  }
}

//  puxa instrutor
async function listarCursosPorInstrutor(req, res) {
  try {
    const { id } = req.params;
    const pool = await conectarBanco();
    const resultado = await pool.request()
      .input('instrutor_id', sql.Int, id)
      .query(`
        SELECT c.*, i.nome AS instrutor_nome
        FROM dbCursos.Cursos c
        INNER JOIN dbCursos.Instrutores i ON c.instrutor_id = i.id
        WHERE c.instrutor_id = @instrutor_id
      `);

    res.json(resultado.recordset);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao filtrar cursos por instrutor' });
  }
}

// aqui inserir
async function cadastrarCurso(req, res) {
  try {
    const { titulo, descricao, instrutor_id, carga_horaria, modalidade, valor } = req.body;

   
    if (!titulo || !instrutor_id || !carga_horaria || !modalidade) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    }

    if (Number(carga_horaria) <= 0) {
      return res.status(400).json({ erro: 'A carga horária deve ser maior que zero.' });
    }

    const pool = await conectarBanco();
    await pool.request()
      .input('titulo', sql.VarChar(150), titulo)
      .input('descricao', sql.VarChar(500), descricao || null)
      .input('instrutor_id', sql.Int, instrutor_id)
      .input('carga_horaria', sql.Int, carga_horaria)
      .input('modalidade', sql.VarChar(30), modalidade)
      .input('valor', sql.Decimal(10, 2), valor || 0)
      .query(`
        INSERT INTO dbCursos.Cursos (titulo, descricao, instrutor_id, carga_horaria, modalidade, valor)
        VALUES (@titulo, @descricao, @instrutor_id, @carga_horaria, @modalidade, @valor)
      `);

    res.status(201).json({ mensagem: 'Curso cadastrado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar curso' });
  }
}

// aqui inseri para mudar
async function atualizarCurso(req, res) {
  try {
    const { id } = req.params;
    const { titulo, descricao, instrutor_id, carga_horaria, modalidade, valor } = req.body;

    if (!titulo || !instrutor_id || !carga_horaria || !modalidade) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    }

    if (Number(carga_horaria) <= 0) {
      return res.status(400).json({ erro: 'A carga horária deve ser maior que zero.' });
    }

    const pool = await conectarBanco();
    const resultado = await pool.request()
      .input('id', sql.Int, id)
      .input('titulo', sql.VarChar(150), titulo)
      .input('descricao', sql.VarChar(500), descricao || null)
      .input('instrutor_id', sql.Int, instrutor_id)
      .input('carga_horaria', sql.Int, carga_horaria)
      .input('modalidade', sql.VarChar(30), modalidade)
      .input('valor', sql.Decimal(10, 2), valor || 0)
      .query(`
        UPDATE dbCursos.Cursos
        SET titulo = @titulo,
            descricao = @descricao,
            instrutor_id = @instrutor_id,
            carga_horaria = @carga_horaria,
            modalidade = @modalidade,
            valor = @valor
        WHERE id = @id
      `);

    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }

    res.json({ mensagem: 'Curso atualizado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar curso' });
  }
}

//aqui deleta
async function excluirCurso(req, res) {
  try {
    const { id } = req.params;
    const pool = await conectarBanco();
    const resultado = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM dbCursos.Cursos WHERE id = @id');

    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }

    res.json({ mensagem: 'Curso excluído com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao excluir curso' });
  }
}

module.exports = {
  listarCursos,
  buscarCursoPorId,
  listarCursosPorInstrutor,
  cadastrarCurso,
  atualizarCurso,
  excluirCurso
};