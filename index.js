import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 

const app = express();
const PUERTO = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), 'views'));

// Rutas
app.get('/', (req, res) => {
  res.render('principal');
});

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}. http://localhost:${PUERTO}`);
});