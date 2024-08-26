export class Obra {
    constructor(id, departamento, localizacion, imagenes, titulo, cultura, dinastia, fechaCreacion) {
      this.id = id;
      this.departamento = departamento;
      this.localizacion = localizacion || null;
      this.imagenes = {
        primaria: imagenes.primaria || null,
        miniatura: imagenes.miniatura || null,
        adicionales: {
          primera: imagenes.adicionales?.primera || null,
          segunda: imagenes.adicionales?.segunda || null,
          tercera: imagenes.adicionales?.tercera || null,
          cuarta: imagenes.adicionales?.cuarta || null
        }
      };
      this.titulo = titulo;
      this.cultura = cultura;
      this.dinastia = dinastia;
      this.fechaCreacion = fechaCreacion;
    }
  
    // Métodos get
    getId() {
      return this.id;
    }
  
    getDepartamento() {
      return this.departamento;
    }
  
    getLocalizacion() {
      return this.localizacion;
    }
  
    getImagenes() {
      return this.imagenes;
    }
  
    getTitulo() {
      return this.titulo;
    }
  
    getCultura() {
      return this.cultura;
    }
  
    getDinastia() {
      return this.dinastia;
    }
  
    getFechaCreacion() {
      return this.fechaCreacion;
    }
  }