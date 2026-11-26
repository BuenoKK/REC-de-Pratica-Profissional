require('dotenv').config();
const app = require('./src/app');
const { getPool } = require('./src/config/dbConnect');

const PORT = process.env.PORT || 3000;

getPool()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Falha ao conectar no banco:', err.message);
    process.exit(1);
  });
