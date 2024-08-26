import translate from 'node-google-translate-skidz'
import { Obra } from './obra.js';


async function getArt(id) {
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
  
  try{
    const response = await fetch(url);
    if(!response.ok){
      throw Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    
    const imagenes = {
      primaria: data.primaryImage || null,  // Imagen principal
      miniatura: data.primaryImageSmall || null,  // Imagen en miniatura
      adicionales: {
        primera: data.additionalImages?.[0] || null,
        segunda: data.additionalImages?.[1] || null,
        tercera: data.additionalImages?.[2] || null,
        cuarta: data.additionalImages?.[3] || null
      }
    };

    let obraObtenida = new Obra(
      data.objectID,
      data.department,
      data.country,
      imagenes,
      data.title,
      data.culture,
      data.dynasty,
      data.objectBeginDate
    )

    return obraObtenida
  }catch (error) { 
    console.log(`Error obteniendo la data: ${error}`);
    return null
  }
}

async function obtenerObras() {
  const obrasDeArte=[]
  for (let index = 1; index < 100; index++) {
    const alrtData = await getArt(index)
    if (alrtData){
      obrasDeArte.push(alrtData);
    }
  }
  return obrasDeArte
}

/*(async ()=>{
  const obrasDeArte = await obtenerObras()
  console.log(obrasDeArte)
})()*/

function traducir(frase) {
  return new Promise((resolve, reject) => {
    translate({
      text: frase,
      source: 'en',
      target: 'es'
    }, function(result) {
      if (result.error) {
        reject(result.error);
      } else {
        resolve(result.translation);
      }
    });
  });
}

/*(async () => {
  try {
    let hola = "bye";
    let traducido = await traducir(hola);
    console.log(traducido);
  } catch (error) {
    console.error("Error en la traducción:", error);
  }
})();*/


let palabra="Hello"

let palabraTraducida = await traducir(palabra)
console.log(palabraTraducida)