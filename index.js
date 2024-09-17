import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { obtenerPagina } from './obras.js';
import { listarDepartamentos } from './departments.js';
import { paginarObrasDepartamento, obtenerIdsPaises, obtenerIdsDepartamento,paginarObrasPais } from './filtro.js';
import { getArt } from './obras.js';
import { isNull } from 'xpress/lib/validate.js';

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
  const departamentoId = parseInt(req.query.departamentoId) || null;
  const pais = req.query.pais || null;
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos();
  console.log("pais " + pais)
  console.log("departamento " + departamentoId)
  try {

    if(departamentoId && pais == "paises"){
     const obtenerPagina = paginarObrasDepartamento(20, departamentoId);
     const obrasDeArte = await obtenerPagina(pagina);
     res.render('obras', { obrasDeArte,departamentos });
    } else if (pais && departamentoId == null) {
     const obtenerPagina = paginarObrasPais(20,pais);
     const obrasDeArte = await obtenerPagina(pagina)
     res.render('obras', { obrasDeArte,departamentos });
    }

    //console.log(obrasDeArte)

    //res.render('obras', { obrasDeArte,departamentos });
  } catch (error) {
    console.log(`Error al obtener las obras: ${error}`);
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
