import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { obtenerPagina,paginarObras } from './obras.js';
import { listarDepartamentos } from './departments.js';
import { paginarObrasDepartamento,paginarObrasPais,paginarObrasDepartamentoPais } from './filtro.js';
import { getArt } from './obras.js';
const app = express();
const PUERTO = 3000;
// Configurar archivos estáticos
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const crearControladorMuseo = () => {
  let primeraVisita = true;

  return async (req, res) => {
    const pagina = parseInt(req.query.page) || 1;
    const departamentos = await listarDepartamentos();
    const obrasDeArte = await obtenerPagina(pagina);

    try {
      if (primeraVisita) {
        // Si es la primera visita, renderiza 'museo'
        res.render('museo', { departamentos, obrasDeArte });
        primeraVisita = false; // Cambia el estado a false después de la primera visita
      } else {
        // Si no es la primera visita, renderiza 'obras'
        res.render('obras', { departamentos, obrasDeArte });
      }
    } catch (error) {
      console.log(`Error al obtener las obras dentro del index.js: ` + error);
      res.status(500).send("Error al obtener las obras de arte");
    }
  };
};

const controladorMuseo = crearControladorMuseo();

app.get('/', (req, res) => {
  res.render('principal'); // Renderiza la página principal con el botón
});

app.get('/museo', controladorMuseo);

app.get('/filtrar/departamento/:departamentoId', async (req, res) => {
  const departamentoId = req.params.departamentoId;
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos();

  try {
    const obtenerPagina = paginarObrasDepartamento(20, departamentoId);
    const obrasDeArte = await obtenerPagina(pagina);
    res.render('obras', { obrasDeArte, departamentos, departamentoId });
  } catch (error) {
    console.error(`Error al obtener las obras por departamento: ${error}`);
    res.status(500).send("Error al obtener las obras");
  }
});

app.get('/filtrar/pais/:pais', async (req, res) => {
  const pais = req.params.pais;
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos();

  try {
    const obtenerPagina = paginarObrasPais(20, pais);
    const obrasDeArte = await obtenerPagina(pagina);
    res.render('obras', { obrasDeArte, departamentos, pais });
  } catch (error) {
    console.error(`Error al obtener las obras por país: ${error}`);
    res.status(500).send("Error al obtener las obras");
  }
});

app.get('/filtrardepartamento/:departamentoId/pais/:pais', async (req, res) => {
  const departamentoId = req.params.departamentoId;
  const pais = req.params.pais;
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos();

  try {
    const obtenerPagina = paginarObrasDepartamentoPais(20, departamentoId, pais);
    const obrasDeArte = await obtenerPagina(pagina);
    res.render('obras', { obrasDeArte, departamentos, departamentoId, pais });
  } catch (error) {
    console.error(`Error al obtener las obras por departamento y país: ${error}`);
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
  console.log(`Servidor escuchando en el puerto ${PUERTO}. http://localhost:3000`);
});
