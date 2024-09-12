import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { obtenerPagina } from './obras.js';
import { listarDepartamentos } from './departments.js';
import { paginarObras } from './filtro.js';
import { getArt } from './obras.js';

const app = express();
const PUERTO = 3000;

// Configurar archivos estáticos
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Ruta principal para mostrar todas las obras
app.get('/', async (req, res) => { 
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos();
  try {
    const obrasDeArte = await obtenerPagina(pagina);
    res.render('principal', { obrasDeArte, pagina, departamentos });
  } catch (error) {
    console.log(`Error al obtener las obras dentro del index.js: ` + error);
    res.status(500).send("Error al obtener las obras de arte");
  }
});

app.get('/filtrar', async (req, res) => {
  const departamentoId = parseInt(req.query.departamentoId) || null; // Obtenemos el departamento o null
  const pagina = parseInt(req.query.page) || 1; // Página actual o la primera
  const departamentos = await listarDepartamentos(); // Listado de departamentos para el menú

  try {
    let obrasDeArte;
    
    // Si hay un departamentoId, usa paginación con filtro
    if (departamentoId) {
      const obtenerPaginaDpto = paginarObras(20, departamentoId);
      obrasDeArte = await obtenerPaginaDpto(pagina);
    } else {
      // Si no hay departamentoId, usa la paginación general
      const obtenerPaginaGeneral = paginarObras(20); // Esto debería paginar sin filtro
      obrasDeArte = await obtenerPaginaGeneral(pagina);
    }

    // Renderiza la vista pasando departamentoId solo si hay filtro
    res.render('principal', { obrasDeArte, pagina, departamentos, departamentoId });
  } catch (error) {
    console.log(`Error al obtener las obras: ` + error);
    res.status(500).send("Error al obtener las obras");
  }
});

// Ruta para mostrar todas las imágenes de una obra
app.get('/imagenes/:id', async (req, res) => {
  const obraId = parseInt(req.params.id);
  
  try {
    const obra = await getArt(obraId); // Obtén la obra usando el ID
    
    if (!obra) {
      return res.status(404).send("Obra no encontrada");
    }
    
    res.render('imagenes', { obra });
  } catch (error) {
    console.log(`Error al obtener la obra con ID ${obraId}: ` + error);
    res.status(500).send("Error al obtener las imágenes");
  }
});


app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}. http://localhost:${PUERTO}`);
});
