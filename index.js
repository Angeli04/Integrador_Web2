import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { obtenerPagina } from './obras.js';

const app = express();
const PUERTO = 3000;

// Configurar archivos estáticos
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/', async (req, res) => { 
  const pagina = parseInt(req.query.page) || 1;

  try {
   const obrasDeArte = await obtenerPagina(pagina)
    res.render('principal', { obrasDeArte,pagina });
  } catch (error) {
    console.log(`Error al obtener las obras dentro del index.js: ` + error);
    res.status(500).send("Error al obtener las obras de arte");
  }
});

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}. http://localhost:${PUERTO}`);
});
