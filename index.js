import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { obtenerPagina,paginarObras } from './obras.js';
import { listarDepartamentos } from './departments.js';
import { paginarObrasDepartamento,paginarObrasPais,paginarObrasDepartamentoPais,paginarObrasFrase,paginarObrasFrasePais,paginarObrasDepartamentoFrase,paginarObrasCompleto } from './filtro.js';
import { getArt } from './obras.js';
const app = express();
const PUERTO = process.env.PORT || 3000;

// Configurar archivos estáticos
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('principal'); // Renderiza la página principal con el botón
});

app.get('/museo', async (req, res) => {
  const departamentos = await listarDepartamentos();
  try {
   res.render('museo',{departamentos})
  } catch (error) {
    console.log(`Error al obtener las obras dentro del index.js: ` + error);
    res.status(500).send("Error al obtener las obras de arte");
  }
});

const obtenerObrasPorDepartamento = paginarObrasDepartamento()

app.get('/filtrar/departamento/:departamentoId', async (req, res) => {
  const departamentoId = req.params.departamentoId;
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos();

  try {
    const obrasDeArte = await obtenerObrasPorDepartamento(pagina,20,departamentoId)
    res.render('obras', { obrasDeArte, departamentos, departamentoId });
  } catch (error) {
    console.error(`Error al obtener las obras por departamento: ${error}`);
    res.status(500).send("Error al obtener las obras");
  }
});

const obtenerObrasPorPais = paginarObrasPais()

app.get('/filtrar/pais/:pais', async (req, res) => {
  const pais = req.params.pais;
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos();

  try {
    const obrasDeArte = await obtenerObrasPorPais(pagina,20,pais)
    res.render('obras', { obrasDeArte, departamentos, pais });
  } catch (error) {
    console.error(`Error al obtener las obras por país: ${error}`);
    res.status(500).send("Error al obtener las obras");
  }
});

const obtenerObrasPorDepartamentoPais = paginarObrasDepartamentoPais()

app.get('/filtrardepartamento/:departamentoId/pais/:pais', async (req, res) => {
  const departamentoId = req.params.departamentoId;
  const pais = req.params.pais;
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos();
  try {
    const obrasDeArte = await obtenerObrasPorDepartamentoPais(pagina,20,departamentoId,pais);
    res.render('obras', { obrasDeArte, departamentos, departamentoId, pais });
  } catch (error) {
    console.error(`Error al obtener las obras por departamento y país: ${error}`);
    res.status(500).send("Error al obtener las obras");
  }
});

const obtenerObrasPorFrase = paginarObrasFrase()

app.get('/filtrar/frase/:frase',async (req,res)=>{
  const frase = req.params.frase
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos();
  try{
    //const obtenerPagina = paginarObrasFrase(20,frase)
    const obrasDeArte = await obtenerObrasPorFrase(pagina,20,frase)
    res.render('obras',{obrasDeArte,departamentos})
  }catch (error) {
    console.log(`Error al obtener las obras por departamento: ${error}`)
    res.status(500).send("Error al obtener las obras")
  }
})

const obtenerObrasPorFrasePais = paginarObrasFrasePais()

app.get('/filtrar/frase/:frase/pais/:pais',async(req,res)=>{
  const pais = req.params.pais
  const frase = req.params.frase
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos();
  try{
    const obrasDeArte = await obtenerObrasPorFrasePais(pagina,20,frase,pais)
    res.render('obras',{obrasDeArte,departamentos})
  }catch (error){
    console.error(`Error al obtener las obras por departamento y país: ${error}`);
    res.status(500).send("Error al obtener las obras");
  }
})

const obtenerObrasPorFraseDepartamento = paginarObrasDepartamentoFrase()

app.get('/filtrar/departamento/:departamento/frase/:frase',async (req,res)=>{
  const frase = req.params.frase
  const departamento = req.params.departamento
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos()
  try{
    const obrasDeArte = await obtenerObrasPorFraseDepartamento(pagina,20,frase,departamento)
    res.render('obras',{obrasDeArte,departamentos})
  }catch (error){
    console.error(`Error al obtener las obras por departamento y país: ${error}`);
    res.status(500).send("Error al obtener las obras");
  }
})

const obtenerObrasTotal = paginarObrasCompleto()

app.get('/filtrar/departamento/:departamento/frase/:frase/pais/:pais',async(req,res)=>{
  const frase = req.params.frase
  const departamento = req.params.departamento
  const pais = req.params.pais
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos()
  try{
    const obrasDeArte = await obtenerObrasTotal(pagina,20,frase,departamento,pais)
    res.render('obras',{obrasDeArte,departamentos})
  }catch{
    console.error(`Error al obtener las obras por departamento y país: ${error}`);
    res.status(500).send("Error al obtener las obras");
  }
})

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

app.get('/obras',async (req, res) => {
  const pagina = parseInt(req.query.page) || 1;
  const departamentos = await listarDepartamentos();
  const obrasDeArte = await obtenerPagina(pagina);

  try {
    res.render('obras', { departamentos, obrasDeArte });
  } catch (error) {
    console.log(`Error al obtener las obras dentro del index.js: ` + error);
    res.status(500).send("Error al obtener las obras de arte");
  }
});

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}. http://localhost:3000`);
});
