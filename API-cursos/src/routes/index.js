const express = require('express');
const router = express.Router();

const instrutorRoutes = require('./instrutorRoutes');
const cursoRoutes = require('./cursoRoutes');

router.use('/instrutores', instrutorRoutes);
router.use('/cursos', cursoRoutes);

module.exports = router;