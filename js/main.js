/////////////////////////////////////////////////////////////////////////////////////////
// Creación de clases
/////////////////////////////////////////////////////////////////////////////////////////

// Clases para teléfonos

class Phone {
    constructor (name, screen, ram, storage, camera, price, img, stock) {
        this.name = name
        this.screen = screen
        this.ram = ram
        this.storage = storage
        this.camera = camera
        this.price = price
        this.img = img
        this.stock = stock
    }
}


/////////////////////////////////////////////////////////////////////////////////////////
// Creación de arrays
/////////////////////////////////////////////////////////////////////////////////////////

// Array de teléfonos instanciados a través de la clase "Phone"

// const phones = [
//     new Phone ("iPhone 14 Pro Max", "6.7 Super Retina", "6Gb", "256Gb", "48MP + 12MP + 12MP", 1500000, "./img/14promax.png"),
//     new Phone ("Samsung s24 Ultra", "6.7 Dynamic AMOLED", "12Gb", "256Gb", "200MP + 12MP + 10MP + 10MP", 2200000, "./img/s24ultra.png"),
//     new Phone ("Samsung s22", "6.1 Dynamic AMOLED", "8Gb", "128Gb", "50MP + 12MP + 10MP", 850000, "./img/S22.png"),
//     new Phone ("Samsung a53", "6.5 Super AMOLED", "8Gb", "128Gb", "64MP + 12MP + 5MP + 5MP", 750000, "./img/a53.png"),
//     new Phone ("Samsung a33", "6.4 Super AMOLED", "6Gb", "128Gb", "48MP + 8MP + 5MP + 2MP", 400000, "./img/a33.png"),
//     new Phone ("Motorola One Vision", "6.3 LCD", "4Gb", "128Gb", "48MP + 5MP", 450000, "./img/one.png")
// ]


// Creación de "cards" a través del array de teléfonos







/////////////////////////////////////////////////////////////////////////////////////////

// Array de carrito de compras

const cart = JSON.parse(localStorage.getItem("cart")) || []


/////////////////////////////////////////////////////////////////////////////////////////
// Globales y DOM
/////////////////////////////////////////////////////////////////////////////////////////

// Variable del valor final de la compra

let totalCost = 0

let phones = []

let timeOutCompleted = false
let pageLoaded = false


/////////////////////////////////////////////////////////////////////////////////////////

// Elementos del modal "info"

const phoneName = document.getElementById("data-name")
const phoneScreen = document.getElementById("data-screen")
const phoneRam = document.getElementById("data-ram")
const phoneStorage = document.getElementById("data-storage")
const phoneCamera = document.getElementById("data-camera")


/////////////////////////////////////////////////////////////////////////////////////////

// Elementos del botón de carrito

const cartQty = document.getElementById("cart-qty")
const cartBtn = document.getElementById("cart-btn")


/////////////////////////////////////////////////////////////////////////////////////////

// Elementos de modales

const infoModal = document.getElementById("info-modal")

const cartModal = document.getElementById("cart-modal")
const cartBody = document.getElementById("cart-body")


/////////////////////////////////////////////////////////////////////////////////////////
// Declaración de funciones
/////////////////////////////////////////////////////////////////////////////////////////

// Función que muestra la información del teléfono seleccionado en un modal

const displayInfo = () => {
    // Creación de HTML Collection de botones y transformación en array
    const infoBtns = document.getElementsByClassName("info-btn")
    const arrayInfoBtns = Array.from(infoBtns)

    // Método forEach para cada botón del array
    arrayInfoBtns.forEach (el => {
        // Evento click para cada botón del array
        el.addEventListener("click", (e) => {
            // Método find para determinar qué información mostrar
            const phoneToShow = phones.find ( (el) => el.name === e.target.parentElement.parentElement.children[1].innerText)
            phoneName.innerText = phoneToShow.name
            phoneScreen.innerText = phoneToShow.screen
            phoneRam.innerText = phoneToShow.ram
            phoneStorage.innerText = phoneToShow.storage
            phoneCamera.innerText = phoneToShow.camera
            infoModal.style.display = "block"
        })
    })
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que agrega el teléfono seleccionado al carrito

const addToCart = () => {
    // Creación de HTML Collection de botones y transformación en array
    const addBtns = document.getElementsByClassName("add-btn")
    const arrayAddBtns = Array.from(addBtns)

    // Método forEach para cada botón del array
    arrayAddBtns.forEach (el => {
        // Evento click para cada botón del array
        el.addEventListener("click", (e) => {
            // Método find para determinar qué teléfono agregar al carrito
            const phoneToAdd = phones.find ( (el) => el.name === e.target.parentElement.parentElement.children[1].innerText)
            // Método push para agregar el teléfono seleccionado
            cart.push(phoneToAdd)
            // Actualización del ícono de carrito
            cartQty.innerText = cart.length
            // Almacenamiento en localStorage
            localStorage.setItem("cart", JSON.stringify(cart))

            // Código provisto por chatGPT para animar el ícono del carrito
            cartBtn.classList.add("jump")
            setTimeout(() => {
                cartBtn.classList.remove("jump");
            }, 1000);
        })
    })
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que cierra el modal cuando se hace click en "X"

const closeModal = () => {
    // Creación de HTML Collection de botones y transformación en array
    const closeBtn = document.getElementsByClassName("close-button")
    const arrayCloseBtn = Array.from(closeBtn)

    // Método forEach para cada botón del array
    arrayCloseBtn.forEach (el => {
        // Evento click para cada botón del array
        el.addEventListener("click", (e) => {
            e.target.parentElement.parentElement.parentElement.style.display="none"
            // Reset del carrito al cerrar el mismo para evitar duplicaciones
            if (e.target.parentElement.parentElement.children[1].id == "cart-body") {
                e.target.parentElement.parentElement.children[1].innerHTML = ""
            }
        })
    })
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que muestra el carrito al hacer click en el ícono

const displayCart = () => {
    // Evento click para el botón de carrito
    cartBtn.addEventListener("click", (e) => {
        updateCart()
        cartModal.style.display="block"
    })
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que actualiza el carrito (cuando se hace click en el ícono o el eliminar)

const updateCart = () => {
    // Reset del carrito para evitar duplicaciones
    cartBody.innerHTML = ""
    // Condicional para decidir qué información mostrar en el carrito
    if (cart == "") {
        cartBody.innerHTML = `
        <p>No tienes elementos en el carrito.</p>
        `
    } else {
        // Reset de la variable que contiene el total para evitar que siga subiendo de valor
        totalCost = 0
        // Método forEach para agregar los elementos al carrito desde el array cart
        cart.forEach (el => {
            cartBody.innerHTML += `
                <div class="cart-phone-container">
                    <img src=${el.img} alt="Foto de ${el.name}">
                    <p>${el.name}</p>
                    <p>$ ${el.price}</p>
                    <input class="delete-btn" type="button" value="Eliminar"></input>
                </div>
            `
            totalCost = totalCost + el.price
        })
        cartBody.innerHTML += `
            <p class="total-cost">Precio final: $ ${totalCost}</p>
            <input id="buy-btn" class="buy-btn" type="button" value="Finalizar compra" ></input>
        `
        endPurchase()
    }
    deleteItem()
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que elimina el teléfono seleccionado del carrito

const deleteItem = () => {
    // Creación de HTML Collection de botones y transformación en array
    const deleteBtns = document.getElementsByClassName("delete-btn")
    const arrayDeleteBtns = Array.from(deleteBtns)
    
    // Método forEach para cada botón del array
    arrayDeleteBtns.forEach (el => {
        // Evento click para cada botón del array
        el.addEventListener("click", e => {
            // Método find para determinar qué teléfono eliminar del carrito
            const phoneToDelete = cart.find((el) => el.name === e.target.parentElement.children[1].innerText)
            // Método indexOf para determinar en qué posición del array se encuentra el teléfono a eliminar
            const phoneToDeleteIndex = cart.indexOf(phoneToDelete)
            // Método splice para eliminar el teléfono seleccionado
            cart.splice (phoneToDeleteIndex, 1)
            // Actualización del ícono de carrito
            cartQty.innerText = cart.length
            // Actualización del localStorage
            localStorage.setItem("cart", JSON.stringify(cart))
            // Llamado a función para mostrar el carrito sin el teléfono eliminado
            updateCart()
        })
    })
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que finaliza la compra

const endPurchase = () => {
    const buyBtn = document.getElementById("buy-btn")
    // Evento click para el botón "terminar compra"
    buyBtn.addEventListener ("click", (e) => {
        // Método splice para vaciar el carrito 
        cart.splice(0, cart.length)
        // Limpieza del localStorage
        localStorage.clear("cart")
        // Actualización del ícono de carrito
        cartQty.innerText = cart.length
        e.target.parentElement.parentElement.parentElement.style.display = "none"
    })
}


const createCards = (phones) => {
    const phoneList = document.getElementById("phone-list")
    phones.forEach (el => {
        phoneList.innerHTML += `
        <div class="phone-box">
            <img src=${el.img} alt="Foto de ${el.name}">
            <p class="box-text">${el.name}</p>
            <p class="box-price">$ ${el.price}</p>
            <div class="buttons-container">
                <input class="info-btn" type="button" value="+ info">
                <input class="add-btn" type="button" value="Agregar">
            </div>
        </div>
        `
    })

    displayInfo()

    addToCart()
}


const obtainJSONData = async () => {
    try {
        const response = await fetch ("./data/data.json")
        const data = await response.json()

        phones = data.phones.map(el => new Phone(
            el.name,
            el.screen,
            el.ram,
            el.storage,
            el.camera,
            el.price,
            el.img,
            el.stock
        ))

        createCards(phones)

    } catch (error) {
        console.error(error.message)
        // Insertar Swal aquí
    }
}

const hideSpinner = () => {
    if (timeOutCompleted && pageLoaded) {
        const spinner = document.getElementById("spinner")
        spinner.classList.add("spinner-fade")
        setTimeout(() => {
            spinner.style.display = "none"
        }, 500)
    }
}


/////////////////////////////////////////////////////////////////////////////////////////
// Llamado a funciones
/////////////////////////////////////////////////////////////////////////////////////////

obtainJSONData()

closeModal()

displayCart()


/////////////////////////////////////////////////////////////////////////////////////////
// Evento de carga del DOM
/////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", (e) => {
    // Actualización del ícono de carrito según datos almacenados en localStorage
    cartQty.innerText = cart.length
})

setTimeout(() => {
    timeOutCompleted = true
    hideSpinner()
}, 2000)

window.addEventListener("load", (e) => {
    pageLoaded = true
    hideSpinner()
})

