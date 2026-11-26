const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

router.get('/', cursoController.listarCursos);
router.get('/instrutor/:id', cursoController.listarCursosPorInstrutor); // antes de /:id!
router.get('/:id', cursoController.buscarCursoPorId);
router.post('/', cursoController.cadastrarCurso);
router.put('/:id', cursoController.atualizarCurso);
router.delete('/:id', cursoController.excluirCurso);

module.exports = router;