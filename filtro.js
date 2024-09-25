import { response } from 'express';
import { traducir, getArt } from './obras.js';

export function paginarObrasDepartamento() {
    
    let indiceID = 0;  // Índice que mantendremos a través del closure
    let obrasGuardadas = []; // Aquí se almacenarán todas las obras obtenidas

    // Este closure mantiene el estado de `indiceID` y `obrasGuardadas`
    return async function obtenerPaginaDpto(pagina,obrasPorPagina,idDepartment) {
        const aver = await obtenerIdsDepartamento(idDepartment); // Obtiene los IDs del departamento
        let inicio = (pagina - 1) * obrasPorPagina;
        let final = pagina * obrasPorPagina;

        // Si ya tienes suficientes obras guardadas para cubrir la página solicitada
        if (obrasGuardadas.length >= final) {
            // Devuelve las obras ya guardadas de esa página
            return obrasGuardadas.slice(inicio, final);
        }

        // Si no tienes suficientes obras, sigue obteniendo hasta llenar la página
        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID]);  // Obtén la obra usando el ID actual del array

            if (obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)) {
                obrasGuardadas.push(obraData); // Guarda la obra en `obrasGuardadas`
                console.log(`${aver[indiceID]} Conseguido`);
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`);
            }
            indiceID++;  // Incrementa el índice para obtener el siguiente ID
        }

        console.log(`Ultimo ID guardado: ${indiceID}`)

        return obrasGuardadas.slice(inicio, final); // Devuelve las obras de la página solicitada
    };
}

export async function obtenerIdsDepartamento(id) {
    try {
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${id}`);
        const data = await response.json();  // Convertir la respuesta a JSON
        const idObras = data.objectIDs;  // Acceder al arreglo objectIDs
        
        if (!idObras || idObras.length === 0) {
            console.log("No se encontraron obras en este departamento.");
            return [];
        }
        
        return idObras;  // Devolver el arreglo de IDs de las obras
    } catch (error) {
        console.error("Error al obtener los IDs del departamento:", error);
        return [];
    }
}

export async function obtenerIdsPaises(pais) {
  
  try{
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${pais}&q=""`)
    const data = await response.json()
    const idObras  = data.objectIDs;

    if(!idObras || idObras.length === 0){
      console.log("No se encontraron obras en este departamento.")
      return []
    }

    return idObras;
  } catch (error) {
    console.error("Error al obtener los IDs del pais:", error);
    return [];
  }

}

export function paginarObrasPais() {
    let indiceID = 0;
    let obrasGuardadas = []

    return async function obtenerPaginaPais(pagina,obrasPorPagina,nombrePais) {
        const aver = await obtenerIdsPaises(nombrePais)
        let inicio = (pagina-1) * obrasPorPagina
        let final = pagina * obrasPorPagina;

        if (obrasGuardadas.length >= final) {
            return obrasGuardadas.slice(inicio, final)
        }

        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID])

            if(obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)){
                obrasGuardadas.push(obraData);
                console.log(`${aver[indiceID]} Conseguido`)
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`)
            }
            indiceID++;
        }
        console.log(`Ultimo ID guardado: ${indiceID}`)
        return obrasGuardadas.slice(inicio,final);
    };
}

export function paginarObrasDepartamentoPais(){

    let indiceID = 0;
    let obrasGuardadas = []

    return async function obtenerPaginaDepartamentoPais(pagina,obrasPorPagina,idDepartment,nombrePais) {
        const idsPaises = await obtenerIdsPaises(nombrePais)
        const idsDepartamento = await obtenerIdsDepartamento(idDepartment)
        let inicio = (pagina-1) * obrasPorPagina
        let final = pagina * obrasPorPagina
        const idsCompletos = idsPaises.filter(numero => idsDepartamento.includes(numero));

        if (obrasGuardadas.length >= final) {
            return obrasGuardadas.slice(inicio,final)
        }

        while (obrasGuardadas.length < final && indiceID < idsCompletos.length){
            const obraData = await getArt(idsCompletos[indiceID])

            if(obraData && !obrasGuardadas.some(o=> o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)){
                obrasGuardadas.push(obraData)
                console.log(`${idsCompletos[indiceID]} Conseguido`)
            } else {
                console.log(`${idsCompletos[indiceID]} Duplicado o no disponible`)
            }
            indiceID++;
        }
        console.log(`Ultimo ID guardado: ${indiceID}`)
        return obrasGuardadas.slice(inicio,final)
    };
}

async function obtenerIdsFrase(frase){
    try{
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=&q=${encodeURIComponent(frase)}`)
        const data = await response.json()
        const idObras = data.objectIDs;

        if(!idObras || idObras.length === 0){
            console.log("No se encontraron obras en este departamento.")
            return []
        }
        return idObras
    } catch (error) {
        console.error("Error al obtener los IDs del pais:", error);
        return [];
    }
}

export function paginarObrasFrase(){
    let indiceID = 0;
    let obrasGuardadas = []

    return async function obtenerPaginaFrase(pagina,obrasPorPagina,frase) {
        const aver = await obtenerIdsFrase(frase) // traigo un arreglo de ids que contienen la frase
        let inicio = (pagina-1) * obrasPorPagina
        let final = pagina * obrasPorPagina;

        if (obrasGuardadas.length >= final) {
            return obrasGuardadas.slice(inicio, final)
        }

        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID])

            if(obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)){
                obrasGuardadas.push(obraData);
                console.log(`${aver[indiceID]} Conseguido`)
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`)
            }
            indiceID++;
        }
        console.log(`Ultimo ID guardado: ${aver[indiceID]}`)
        return obrasGuardadas.slice(inicio,final);
    }
}

async function obtenerIdsFrasePais(frase,pais) {
    
    try{
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${pais}&q=${frase}`)
        const data = await response.json()
        const idObras = data.objectIDs
        if(!idObras || idObras.length === 0){
            console.log("No se encontraron obras en este departamento.")
            return []
        }
        return idObras

    } catch (error) {
        console.error("Error al obtener los IDs del pais:", error);
        return [];
    }

}

export function paginarObrasFrasePais(){
    let indiceID = 0;
    let obrasGuardadas = []
    return async function obtenerPaginaFrasePais(pagina,obrasPorPagina,frase,pais){
        const aver = await obtenerIdsFrasePais(frase,pais)
        let inicio = (pagina-1) * obrasPorPagina
        let final = pagina * obrasPorPagina;
        if(obrasGuardadas.length >=final){
            return obrasGuardadas.slice(inicio,final)
        }
        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID])

            if(obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)){
                obrasGuardadas.push(obraData);
                console.log(`${aver[indiceID]} Conseguido`)
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`)
            }
            indiceID++;
        }
        console.log(`Ultimo ID guardado: ${aver[indiceID]}`)
        return obrasGuardadas.slice(inicio,final);
    }
}

async function obtenerIdsDepartamentoFrase(departamento,frase) {
    try{
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${departamento}&q=${frase}`)
        const data = await response.json()
        const idObras = data.objectIDs
        if(!idObras || idObras.length === 0){
            console.log("No se encontraron obras en este departamento.")
            return []
        }
        return idObras

    } catch (error) {
        console.error("Error al obtener los IDs del pais:", error);
        return [];
    }
}

export function paginarObrasDepartamentoFrase(){
    let indiceID = 0;
    let obrasGuardadas = []
    return async function obtenerPaginaDepartamentoFrase(pagina,obrasPorPagina,frase,departamento) {
        const aver = await obtenerIdsDepartamentoFrase(departamento,frase)
        let inicio = (pagina-1) * obrasPorPagina
        let final = pagina * obrasPorPagina;
        if(obrasGuardadas.length >=final){
            return obrasGuardadas.slice(inicio,final)
        }
        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID])

            if(obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)){
                obrasGuardadas.push(obraData);
                console.log(`${aver[indiceID]} Conseguido`)
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`)
            }
            indiceID++;
        }
        console.log(`Ultimo ID guardado: ${aver[indiceID]}`)
        return obrasGuardadas.slice(inicio,final);
    }
}

async function obtenerIdsDepartamentoFrasePais(departamento,frase,pais) {

    try{
        const idsDepartamento = await obtenerIdsDepartamentoFrase(departamento,frase)
        //const idsFrase = await obtenerIdsDepartamento(departamento,frase)
        const idsPais = await obtenerIdsFrasePais(frase,pais)
        const idObras = idsDepartamento.filter(id=>idsPais.includes(id));
        if(!idObras || idObras.length === 0){
            console.log("No se encontraron obras en este departamento.")
            return []
        }
        return idObras

    } catch (error) {
        console.error("Error al obtener los IDs del pais:", error);
        return [];
    }
}

export function paginarObrasCompleto(){
    let indiceID = 0
    let obrasGuardadas = []

    return async function obtenerPaginaCompleto(pagina,obrasPorPagina,frase,departamento,pais){
        const aver = await obtenerIdsDepartamentoFrasePais(departamento,frase,pais)
        let inicio = (pagina-1) * obrasPorPagina
        let final = pagina * obrasPorPagina;
        if(obrasGuardadas.length >=final){
            return obrasGuardadas.slice(inicio,final)
        }
        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID])

            if(obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)){
                obrasGuardadas.push(obraData);
                console.log(`${aver[indiceID]} Conseguido`)
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`)
            }
            indiceID++;
        }
        console.log(`Ultimo ID guardado: ${aver[indiceID]}`)
        return obrasGuardadas.slice(inicio,final);
    }
}