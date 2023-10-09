class Producto {
  constructor(dato, nombre, cantidad, costo) {
    this.dato = dato;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.costo = costo;
    this.siguiente = null;
    this.anterior = null;
  }
  infoHTML() {
    return `
        <div class="producto">
            <h1>${this.dato}</h1>
            <p>${this.nombre}</p>
            <p>${this.cantidad}</p>
            <p>${this.costo}</p> 
        </div>
        `;
  }
}

class Inventario {
  constructor() {
    this.primero = null;
  }
  agregar(nuevo) {
    if (this.primero == null) {
      this.primero = nuevo;
    } else {
      let actual = this.primero;
      let anterior = null;

      while (actual != null && nuevo.dato > actual.dato) {
        anterior = actual;
        actual = actual.siguiente;
      }

      nuevo.siguiente = actual;
      nuevo.anterior = anterior;

      if (anterior != null) {
        anterior.siguiente = nuevo;
      } else {
        this.primero = nuevo;
      }

      if (actual != null) {
        actual.anterior = nuevo;
      }
    }
  }
  listar() {
    if (this.primero == null) return "";
    else return this._listarRec(this.primero);
  }
  _listarRec(nodoX, info = "") {
    if (nodoX) {
      info += nodoX.infoHTML();
      info = this._listarRec(nodoX.siguiente, info);
    }
    return info;
  }

  buscar(dato) {
    let aux = this.primero;

    while (aux !== null) {
      if (aux.dato == dato) {
        return aux;
      }
      aux = aux.siguiente;
    }

    return null;
  }
  extraer(dato) {
    let ultimo = this.primero;
    let extraido = null;

    if (ultimo != null) {
      if (ultimo.dato == dato) {
        extraido = ultimo;

        if (ultimo.siguiente == null) {
          //Primero sin siguiente
          this.primero = null;
        } else {
          //Primero con siguiente
          ultimo.siguiente.anterior = null;
          this.primero = ultimo.siguiente;
          ultimo.siguiente = null;
        }
      } else {
        while (ultimo.dato != dato) {
          ultimo = ultimo.siguiente;
        }

        extraido = ultimo;

        if (ultimo.siguiente == null) {
          //Ultimo
          ultimo.anterior.siguiente = null;
          ultimo.anterior = null;
        } else {
          //En medio
          ultimo.anterior.siguiente = ultimo.siguiente;
          ultimo.siguiente.anterior = ultimo.anterior;
          ultimo.siguiente = null;
          ultimo.anterior = null;
        }
      }
    }
    return extraido;
  }
  listarInverso() {
    if (this.primero == null) {
      return "";
    } else {
      return this._listarInversoRec(this.primero);
    }
  }

  _listarInversoRec(nodoX, info = "") {
    if (nodoX) {
      info = this._listarInversoRec(nodoX.siguiente, info);
      info += nodoX.infoHTML();
    }
    return info;
  }
}
const btnAdd = document.getElementById("btnAdd");
const btnList = document.getElementById("btnList");
const btnSearch = document.getElementById("btnSearch");
const btnextract = document.getElementById("btnExtract");
const btnrvrsList = document.getElementById("btnRvrsList");

const miInventario = new Inventario()

let detalles = document.getElementById("detalles") //div para mostrar detalles

btnAdd.addEventListener('click', () => {
    let dato = Number(document.getElementById('dato').value);
    let nom = document.getElementById('nombre').value;
    let cant = document.getElementById('cantidad').value;
    let cost = document.getElementById('costo').value;
    
    if (dato != "" && nom != "" && cant != "" && cost != "") {
        let nuevo = new Producto(dato, nom, cant, cost);
        miInventario.agregar(nuevo)
        detalles.innerHTML = `Producto con código: ${dato} agregado`
    }
    else {
        detalles.innerHTML = "No puedes dejar ningún campo vacío"
    }
})
btnList.addEventListener('click',()=>{
    if (miInventario.listar() == null) {
        detalles.innerHTML = "No hay ningún elemento para listar";
      } else {
        detalles.innerHTML = "<h2>Inventario</h2>";
        detalles.innerHTML += miInventario.listar();
      }
    });
    btnSearch.addEventListener('click', () => {
        let dato = Number(document.getElementById('dato').value);
        let productoEncontrado = miInventario.buscar(dato);
    
        if (productoEncontrado !== null) {
            detalles.innerHTML = `Producto encontrado: ${productoEncontrado.nombre}`;
        } else {
            detalles.innerHTML = `Producto con código ${dato} no encontrado en el inventario.`;
        }
    });
    
    btnExtract.addEventListener('click', () => {
        let dato = Number(document.getElementById('dato').value);
    
        let productoExtraido = miInventario.extraer(dato);
    
        if (productoExtraido !== null) {
            detalles.innerHTML = `Producto con código: ${dato} extraído del inventario`;
        } else {
            detalles.innerHTML = `Producto con código ${dato} no encontrado en el inventario`;
        }
    });
    
    btnRvrsList.addEventListener('click', () => {
        if (miInventario.listarInverso() == null) {
            detalles.innerHTML = "No hay ningún elemento para listar inversamente";
        } else {
            detalles.innerHTML = "<h2>Inventario Inverso</h2>";
            detalles.innerHTML += miInventario.listarInverso();
        }
    });
    