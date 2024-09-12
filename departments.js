// Importaciones necesarias
//import fetch from 'node-fetch'; // Si usas Node.js
import translate from 'node-google-translate-skidz';

// Clase Departamento
class Departamento {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }
}

// Función para traducir texto
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

// Función para obtener departamentos y traducir nombres
async function listarDepartamentos() {
  const url = 'https://collectionapi.metmuseum.org/public/collection/v1/departments';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP! status: ${response.status}`);
    }

    const datos = await response.json();
    const departamentos = [];

    // Iterar sobre los departamentos y traducir los nombres
    for (const dep of datos.departments) {
      const nombreTraducido = await traducir(dep.displayName); // Traducir el nombre
      const departamento = new Departamento(dep.departmentId, nombreTraducido); // Crear instancia de Departamento
      departamentos.push(departamento); // Añadir al arreglo
    }
    departamentos[0].nombre="El ala americana"
    return departamentos;
  } catch (error) {
    console.error('Error al obtener los departamentos:', error);
  }
}

export { listarDepartamentos };