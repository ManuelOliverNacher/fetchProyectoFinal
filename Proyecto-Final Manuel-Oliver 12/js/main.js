
const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('carrito-contenedor')
const contadorCarrito = document.getElementById('contadorCarrito')
const precioTotal = document.getElementById('precioTotal')
const botonVaciar = document.getElementById('vaciar-carrito')
const contenedorModal = document.getElementsByClassName('modal-contenedor')[0]
const botonAbrir = document.getElementById('boton-carrito')
const botonCerrar = document.getElementById('carritoCerrar')
const modalCarrito = document.getElementsByClassName('modal-carrito')[0]



botonAbrir.addEventListener('click', ()=>{
    contenedorModal.classList.toggle('modal-active')
})
botonCerrar.addEventListener('click', ()=>{
    contenedorModal.classList.toggle('modal-active')
})

contenedorModal.addEventListener('click', (event) =>{
    contenedorModal.classList.toggle('modal-active')

})
modalCarrito.addEventListener('click', (event) => {
    event.stopPropagation() 
    
})
localStorage.setItem("Productos" , JSON.stringify(stockProductos))

let carrito = []
carrito.length === 0 && console.log("Actualmente no hay productos en el carrito");

botonVaciar.addEventListener('click', () => {
    
    Swal.fire({
        title: 'Estas seguro?',
        text: "Se eliminara automaticamente el producto del carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminalo!'
      }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0
            actualizarCarrito()
          Swal.fire(
            'Eliminado!',
            'El producto fue eliminado del carrito.',
            'success'
            
          )
        }
      })
})

const traerDatos = async () => {
    let respuesta = await fetch('./stock.json')
    return respuesta.json()
}

const verProductos = async () =>{
    let productoPanelVista= ''
    let productos = await traerDatos()
    productos.forEach( producto => {
    const {img ,desc ,nombre ,precio, id} = producto
        

        productoPanelVista +=
       `
                        <div class="card" style="width: 21rem;;">
                         <img src="img/${img}" alt="${desc}" class="card-img-top" >
                         <div class="card-body">
                         <h5 class="card-title text-center">${nombre}</h5>
                         <p class="card-text text-center">$ ${precio}</p>
                         <button id="${id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
                         </div>
                        </div>  ` 
                        

        
 
       contenedorProductos.innerHTML = productoPanelVista

       const botonAgregar = document.getElementsByClassName('boton-agregar')
        

        for (const btn of botonAgregar) {
               btn.addEventListener ("click" , () =>{
                
                agregarAlCarrito(btn.id)

                Swal.fire({
                    icon: 'success',
                    title: 'El producto se agrego al carrito',
                    showConfirmButton: false,
                    timer: 1500
                })
                

            })
        }

    
    })
    
}
verProductos()
   
    function agregarAlCarrito(id){
        let prodExiste = carrito.find(elemento => elemento.id == id)

        if (prodExiste){
        prodExiste.cantidad = prodExiste.cantidad + 1
        document.getElementById(`cantidad${prodExiste.id}`).innerHTML = `<p id="cantidad${prodExiste.id}">cantidad: ${prodExiste.cantidad}</p>`
        actualizarCarrito()
        }else{
            let productoAgregar = stockProductos.find(ele => ele.id == id)
            let cantidad
             productoAgregar.cantidad = 1
            carrito.push(productoAgregar)
            actualizarCarrito()
            mostrarCarrito(productoAgregar)
        }
        
        
    }
    
    
function mostrarCarrito(productoAgregar){

    let div = document.createElement('div')
    let {nombre, precio, id, cantidad} = productoAgregar
    div.classList.add('productoEnCarrito')
    div.innerHTML = ` 
                      <p> ${nombre}</p>
                      <p>Precio: $ ${precio}</p>
                      <p id="cantidad${id}">cantidad: ${cantidad}</p>
                      <button id="eliminar${id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button> `
    contenedorCarrito.appendChild(div)

    let btnEliminar= document.getElementById(`eliminar${productoAgregar.id}`)
    btnEliminar.addEventListener('click', () =>{
    if(productoAgregar.cantidad==1){
        btnEliminar.parentElement.remove()
        carrito = carrito.filter(item => item.id !== productoAgregar.id)
        actualizarCarrito()
    }else{
        productoAgregar.cantidad = productoAgregar.cantidad - 1
        document.getElementById(`cantidad${productoAgregar.id}`).innerHTML = `<p id="cantidad${productoAgregar.id}">cantidad: ${productoAgregar.cantidad}</p>`
        actualizarCarrito()
    }
    })

}

function actualizarCarrito (){
contadorCarrito.innerText = carrito.reduce((acc,el )=> acc + el.cantidad, 0)
precioTotal.innerText = carrito.reduce((acc, el) => acc + (el.precio * el.cantidad) , 0 )
}















































