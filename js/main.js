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

// Array de teléfonos que se instanciarán a través de la clase "Phone"

let phones = []


// Array de carrito de compras

const cart = JSON.parse(localStorage.getItem("cart")) || []


/////////////////////////////////////////////////////////////////////////////////////////
// Globales y DOM
/////////////////////////////////////////////////////////////////////////////////////////

// Variable del valor final de la compra

let totalCost = 0


// Variable del descuento

let discount = 0


// Variables para el funcionamiento del spinner

let timeOutCompleted = false
let pageLoaded = false


// Elementos del botón de carrito

const cartQty = document.getElementById("cart-qty")
const cartBtn = document.getElementById("cart-btn")


// Elementos de modales

const cartModal = document.getElementById("cart-modal")


// Elementos del buscador

const searchText = document.getElementById("search-text")
const searchBtn = document.getElementById("search-btn")
const toggleSearchIcon = document.getElementById("toggle-search")


// Elementos del modo oscuro

let darkMode = localStorage.getItem("dark")
const darkModeBtn = document.getElementById("toggle-dark")


/////////////////////////////////////////////////////////////////////////////////////////
// Declaración de funciones
/////////////////////////////////////////////////////////////////////////////////////////

// Función que muestra la información del teléfono seleccionado en un modal

const displayInfo = () => {
    // Elementos del modal info
    const infoModal = document.getElementById("info-modal")
    const phoneName = document.getElementById("data-name")
    const phoneScreen = document.getElementById("data-screen")
    const phoneRam = document.getElementById("data-ram")
    const phoneStorage = document.getElementById("data-storage")
    const phoneCamera = document.getElementById("data-camera")

    // Creación de HTML Collection de botones y transformación en array
    const infoBtns = document.getElementsByClassName("info-btn")
    const arrayInfoBtns = Array.from(infoBtns)

    // Método forEach para cada botón del array y listener de eventos "click"
    arrayInfoBtns.forEach (el => {
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

// Función que cierra el modal cuando se hace click en "X"

const closeModal = () => {
    // Creación de HTML Collection de botones y transformación en array
    const closeBtn = document.getElementsByClassName("close-button")
    const arrayCloseBtn = Array.from(closeBtn)

    // Método forEach para cada botón del array y listener de eventos "click"
    arrayCloseBtn.forEach (el => {
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

// Función que agrega el teléfono seleccionado al carrito

const addToCart = () => {
    // Creación de HTML Collection de botones y transformación en array
    const addBtns = document.getElementsByClassName("add-btn")
    const arrayAddBtns = Array.from(addBtns)

    // Método forEach para cada botón del array y listener de eventos "click"
    arrayAddBtns.forEach (el => {
        el.addEventListener("click", (e) => {
            // Método find para determinar qué teléfono agregar al carrito
            const phoneToAdd = phones.find ( (el) => el.name === e.target.parentElement.parentElement.children[1].innerText)
            const isPhoneAlreadyAdded = cart.find ( (el) => el.name === phoneToAdd.name)

            // Condicional If para determinar si el teléfono ya está agregado y agruparlos
            if (isPhoneAlreadyAdded) {
                phoneToAdd.qty++
            } else {
                phoneToAdd.qty = 1
                cart.push(phoneToAdd)
            }

            // Actualización del ícono de carrito
            cartQty.innerText = cartBadgeTotalizer()
            
            // Almacenamiento en localStorage
            localStorage.setItem("cart", JSON.stringify(cart))

            // Animación del Badge de carrito
            cartBtn.classList.add("jump")
            setTimeout(() => {
                cartBtn.classList.remove("jump");
            }, 1000);

            // Notificación tipo "toast" mostrando el nombre del teléfono agregado
            Swal.fire({
                position: "top-end",
                text: `Se agregó ${phoneToAdd.name} al carrito`,
                toast: true,
                color: "#AE31BF",
                background: "#F4DFF5",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
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

// Función que actualiza el carrito (cuando se hace click en el ícono o en eliminar)

const updateCart = () => {
    const cartBody = document.getElementById("cart-body")
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
                    <p class="cart-phone-qty">${el.qty}x</p>
                    <p>${el.name}</p>
                    <p>$ ${el.price}</p>
                    <input class="delete-btn" type="button" value="Eliminar"></input>
                </div>
            `
            totalCost = totalCost + el.price * el.qty
        })
        // innerHTML para agregar el total y el botón para ir al checkout SÓLO si hay teléfonos en el carrito
        cartBody.innerHTML += `
            <p class="total-cost">Precio final: $ ${totalCost}</p>
            <input id="checkout-btn" class="close-button checkout-btn" type="button" value="Ir a pagar" ></input>
        `
        deleteItem() // Agrega un listener de clicks al botón "Eliminar"

        displayCheckoutList() // Agrega un listener de clicks al botón "Ir a pagar"
    }
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que elimina el teléfono seleccionado del carrito

const deleteItem = () => {
    // Creación de HTML Collection de botones y transformación en array
    const deleteBtns = document.getElementsByClassName("delete-btn")
    const arrayDeleteBtns = Array.from(deleteBtns)
    
    // Método forEach para cada botón del array  y listener de eventos "click"
    arrayDeleteBtns.forEach (el => {
        el.addEventListener("click", e => {
            // Método find para determinar qué teléfono eliminar del carrito
            const phoneToDelete = cart.find((el) => el.name === e.target.parentElement.children[2].innerText)

            // Condicional If para determinar si hay más de un teléfono de ese tipo agregado
            if (phoneToDelete.qty >= 2) {
                phoneToDelete.qty--
            } else {
                // Método indexOf para determinar en qué posición del array se encuentra el teléfono a eliminar
                const phoneToDeleteIndex = cart.indexOf(phoneToDelete)
                // Método splice para eliminar el teléfono seleccionado
                cart.splice (phoneToDeleteIndex, 1)
            }

            // Actualización del ícono de carrito
            cartQty.innerText = cartBadgeTotalizer()

            // Actualización del localStorage
            localStorage.setItem("cart", JSON.stringify(cart))

            // Notificación tipo "toast" mostrando el nombre del teléfono eliminado
            Swal.fire({
                position: "top-end",
                text: `Se eliminó ${phoneToDelete.name} del carrito`,
                toast: true,
                color: "#AE31BF",
                background: "#F4DFF5",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });

            // Llamado a función para mostrar el carrito sin el teléfono eliminado
            updateCart()
        })
    })
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función reutilizable para mostrar / ocultar elementos

const toggleVisibility = (elementsToShow, elementsToHide) => {
    elementsToShow.forEach(el => el.style.display = "block")
    elementsToHide.forEach(el => el.style.display = "none")
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que muestra la pantalla de checkout y muestra el carrito final

const displayCheckoutList = () => {
    const checkoutBtn = document.getElementById("checkout-btn")
    const purchaseList = document.getElementById("purchase-list")
    const subtotal = document.getElementById("subtotal")

    // Listener de eventos "click" para el botón "Ir a pagar"
    checkoutBtn.addEventListener("click", () => {
        const checkoutPage = document.getElementById("checkout-page")
        const mainPage = document.getElementById("main-page")

        // Llamado a función para ocultar la página principal y mostrar el checkout
        toggleVisibility([checkoutPage], [mainPage, toggleSearchIcon, cartModal])

        // Reset de la lista de compras para evitar duplicaciones
        purchaseList.innerHTML = ""

        // Método forEach para agregar cada teléfono a la lista de compras
        cart.forEach (el => {
            purchaseList.innerHTML += `
                <div class="checkout-phone-container">
                    <img src=${el.img} alt="Foto de ${el.name}">
                    <p>${el.qty}x</p>
                    <p class="checkout-phone-name">${el.name}</p>
                    <p class="checkout-phone-price">$ ${el.price}</p>
                </div>
            `
        })

        subtotal.innerText = `Subtotal: $ ${totalCost}`
    })
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que oculta la pantalla de checkout y vuelve a la sección principal

const hideCheckoutList = () => {
    const continueBtn = document.getElementById("continue-btn")
    const mainPage = document.getElementById("main-page")
    const checkoutPage = document.getElementById("checkout-page")

    continueBtn.addEventListener("click", () => {
        toggleVisibility([mainPage, toggleSearchIcon],[checkoutPage])
    })
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que configura el checkout según las opciones seleccionadas

const configCheckoutForm = () => {
    const optionCash = document.getElementById("option-cash")
    const optionCard = document.getElementById("option-card")
    const duesQty = document.getElementById("dues-qty")
    const detailsDisplayLabel = document.getElementById("details-display-label")
    const detailsDisplay = document.getElementById("details-display")

    // Listener de cambios en la opción "efectivo" que actualiza labels e inputs
    optionCash.addEventListener("change", () => {
        if (optionCash.checked) {
            duesQty.disabled = true
            detailsDisplayLabel.innerText = "Descuento"
            detailsDisplay.value = 100 - 100 * discount + "%"
        }

        updateCheckoutCosts()
    })

    // Listener de cambios en la opción "tarjeta" que actualiza labels e inputs
    optionCard.addEventListener("change", () => {
        if (optionCard.checked) {
            duesQty.disabled = false
            detailsDisplayLabel.innerText = "Valor de la cuota"

            updateDuesAmount()
        }

        updateCheckoutCosts()
    })

    // Listener de cambios en el select de cuotas que actualiza el valor de cada cuota
    duesQty.addEventListener("change", () => {
        if (optionCard.checked) {
            updateDuesAmount()
        }
    })
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que actualiza los valores totales y de cuota

const updateCheckoutCosts = () => {
    const optionCash = document.getElementById("option-cash")
    const optionCard = document.getElementById("option-card")
    const duesQty = document.getElementById("dues-qty")
    const detailsDisplay = document.getElementById("details-display")
    const checkoutTotal = document.getElementById("checkout-total")

    if (optionCash.checked) {
        checkoutTotal.value = totalCost * discount
    } else if (optionCard.checked) {
        detailsDisplay.value = (totalCost / (duesQty.value || 1)).toFixed(2)
        checkoutTotal.value = totalCost
    }
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que actualiza sólo los valores de cuota

const updateDuesAmount = () => {
    const duesQty = document.getElementById("dues-qty")
    const detailsDisplay = document.getElementById("details-display")

    if (duesQty.value > 0) {
        detailsDisplay.value = (totalCost / duesQty.value).toFixed(2)
    } else {
        detailsDisplay.value = ""
    }
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que actualiza el número que se muestra en el ícono del carrito

const cartBadgeTotalizer = () => {
    let totalQty = 0
    cart.forEach (el => {
        totalQty = totalQty + el.qty
    })
    return (totalQty)
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que controla que todos los campos del checkout se hayan completado

const validateForm = () => {
    const checkoutName = document.getElementById("checkout-name")
    const checkoutMail = document.getElementById("checkout-mail")
    const optionCash = document.getElementById("option-cash")
    const optionCard = document.getElementById("option-card")

    if (checkoutName.value.trim() === "") {
        Swal.fire({
            text: "Ingrese su nombre para continuar con la compra",
            background: "#f6f6f6",
            confirmButtonColor: "#AE31BF",
            icon: "error"
        });
        return false
    } else if (checkoutMail.value.trim() === "") {
        Swal.fire({
            text: "Ingrese una dirección de correo electrónico para finalizar la compra",
            background: "#f6f6f6",
            confirmButtonColor: "#AE31BF",
            icon: "error"
        });
        return false
    } else if (!optionCard.checked && !optionCash.checked) {
        Swal.fire({
            text: "Seleccione un método de pago, por favor",
            background: "#f6f6f6",
            confirmButtonColor: "#AE31BF",
            icon: "error"
        });
        return false
    }
    return true
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que finaliza la compra

const endPurchase = () => {
    const buyBtn = document.getElementById("buy-btn")
    const checkoutName = document.getElementById("checkout-name")
    const mainPage = document.getElementById("main-page")
    const checkoutPage = document.getElementById("checkout-page")

    // Listener de clicks para el botón "Terminar compra"
    buyBtn.addEventListener ("click", () => {
        // Condicional if: si algún campo no está completo termina la ejecución de la función
        if (!validateForm()) {
            return
        } else {
            Swal.fire({
                icon: "success",
                title: `¡Muchas gracias por tu compra ${checkoutName.value}!`,
                text: "A la brevedad nos estaremos contactando con vos",
                background: "#f6f6f6",
                confirmButtonColor: "#AE31BF",
                footer: `Compraste ${cartBadgeTotalizer()} artículos`
            }).then (() => {
                // Método splice para vaciar el carrito 
                cart.splice(0, cart.length)
                // Limpieza del localStorage
                localStorage.removeItem("cart")
                // Actualización del ícono de carrito
                cartQty.innerText = cartBadgeTotalizer()
            });
        }

        toggleVisibility([mainPage, toggleSearchIcon],[checkoutPage])
    })    
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que crea las tarjetas de los teléfonos a partir de la información de data.json

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

    displayInfo() // Agrega listeners a los botones "+ info"

    addToCart() // Agrega listeners a los botones "Agregar"
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que trae las promociones y configura el DOM

const loadPromo = (promo) => {
    const headerPromoText = document.getElementById("header-promo-text")
    headerPromoText.innerText = promo.text

    // Se almacena el descuento alojado en JSON en la variable discount
    discount = promo.discount

    // Se configura el DOM según las cuotas alojadas en JSON
    const duesQty = document.getElementById("dues-qty")
    for (i = 2; i <= promo.dues; i++) {
        duesQty.innerHTML += `
            <option value=${i}>${i} cuotas</option>
        `
    }
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que obtiene la información alojada en data.json e instancia objetos

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

        loadPromo(data.promo[0])

        createCards(phones)

    } catch (error) {
        console.error(error.message)

        Swal.fire({
            icon: "error",
            title: "Ups!...",
            text: "Se ha producido un error inesperado",
            background: "#f6f6f6",
            confirmButtonColor: "#AE31BF",
            footer: `Error: ${error.message}`
        });
    }
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que oculta el spinner de carga inicial

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

// Función que busca teléfonos según el texto ingresado

const searchPhone = (event) => {
    const phoneToSearch = phones.filter (el =>  el.name.toLowerCase().includes(event.target.parentElement.children[0].value.toLowerCase()))

    if (phoneToSearch == "") {
        Swal.fire({
            icon: "error",
            text: "No se ha encontrado ningún teléfono con ese nombre",
            background: "#f6f6f6",
            confirmButtonColor: "#AE31BF",
        });
        return
    } else {
        searchText.value = ""
        const phoneList = document.getElementById("phone-list")
        phoneList.innerHTML = ""
        createCards(phoneToSearch)
    }
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que agrega eventos al texto de búsqueda (keydown) y al botón (click)

const addSearchListener = (element, event) => {
    element.addEventListener(event, (e) => {
        if (event === "click" || (event === "keydown" && e.key === "Enter")) {
            e.preventDefault();
            searchPhone(e)
        }
    })
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que muestra y oculta el buscador de teléfonos

const showAndHideSearcher = () => {
    const phoneSearchDiv = document.getElementById("phone-search")
    toggleSearchIcon.addEventListener("click", () => {
        phoneSearchDiv.classList.toggle("show")
    })
}


/////////////////////////////////////////////////////////////////////////////////////////

// Función que alterna entre modo oscuro y modo claro

const toggleDarkMode = () => {
    if (darkMode == null) {
        localStorage.setItem("dark", "false")
    } else if (darkMode == "true") {
        document.body.classList.toggle("dark-mode")
        darkModeBtn.innerHTML = `
        <i class="fa-solid fa-sun" style="color: #000000;"></i>
        `
    }

    darkModeBtn.addEventListener ("click", () => {
        document.body.classList.toggle("dark-mode")

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("dark", "true")
            darkModeBtn.innerHTML = `
            <i class="fa-solid fa-sun" style="color: #000000;"></i>
            `
        } else {
            localStorage.setItem("dark", "false")
            darkModeBtn.innerHTML = `
            <i class="fa-solid fa-moon" style="color: #000000;"></i>
            `
        }
    })
}


/////////////////////////////////////////////////////////////////////////////////////////
// Llamado a funciones
/////////////////////////////////////////////////////////////////////////////////////////

obtainJSONData()

closeModal()

displayCart()

addSearchListener(searchBtn, "click")

addSearchListener(searchText, "keydown")

showAndHideSearcher()

toggleDarkMode()

configCheckoutForm()

hideCheckoutList()

updateCheckoutCosts()

endPurchase()


/////////////////////////////////////////////////////////////////////////////////////////
// Evento de carga del DOM
/////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    // Actualización del ícono de carrito según datos almacenados en localStorage
    cartQty.innerText = cartBadgeTotalizer()
})

setTimeout(() => {
    timeOutCompleted = true
    hideSpinner()
}, 1000)

window.addEventListener("load", () => {
    pageLoaded = true
    hideSpinner()
})

