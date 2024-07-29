function closebtn(){
    document.querySelector('.cartItems').style.display='none';
}

function search() {
    let filter = document.getElementById('find').value.toUpperCase();
    let items = document.querySelectorAll('.product');

    items.forEach(item => {
        let titleElement = item.querySelector('h5');
        let value = titleElement ? titleElement.innerText.toUpperCase() : '';

        if (value.includes(filter)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}

let products = JSON.parse(localStorage.getItem("data")) || [];
console.log(products);
function displayCart() {
    const cartItems=document.querySelector('.cartItems');
    const shoppingCart = document.getElementById('shoppingCart');
    shoppingCart.innerHTML = ''; 

    products.forEach(item => {
        const cardItem = `

            <div class="card" style="width: 200px;height:200px display=inline-block">
                <img class="card-img-top" src="${item.imageSrc}" alt="${item.name}"  style="display:inline-block;">
                <div class="card-body" style="display:inline-block;height:100px width:100px">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.price}.</p>
                    <div class="quantity" >
                        <input type="number" value="1" min="1" style="width: 50px;">
                    </div>
                    <button class="btn btn-danger remove-from-cart" data-id="${item.id}">Remove</button> <!-- Add Remove button -->
                </div>
            </div>
        `
        console.log(cardItem)
        ;
        shoppingCart.insertAdjacentHTML('beforeend', cardItem);
        updateQuantity() ;
        displayTotal();
    });
     cartItems.style.display = 'block';
    
}

document.querySelectorAll('.add-to-cart').forEach(item => {
    item.addEventListener('click', event => {
        const element = event.target;
        const newItem = {
            id: element.dataset.id,
            name: element.dataset.name,
            price: element.getAttribute('data-price'),
            imageSrc: element.getAttribute('data-imageSrc'),
            unitPrice:element.getAttribute('data-price')
        };
        products.push(newItem);
        localStorage.setItem("data", JSON.stringify(products));
        showPopup('New product added to cart!');
        // displayCart();
        displayTotal();
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const cartButton = document.getElementById('cartButton');
    const body = document.body;
    var cartItems = document.querySelector('.cartItems');
    cartButton.addEventListener('click', function() {
        body.classList.add('blur');
        
        displayCart();
        
    });

    document.querySelector('.cartItems .close').addEventListener('click', function() {
        body.classList.remove('blur');
        cartItems.style.display = 'none';
    });
});


document.addEventListener('click', function remove(event) {
    if (event.target.classList.contains('remove-from-cart')) {
        const itemIdToRemove = event.target.dataset.id;
        const itemIndexToRemove = products.findIndex(item => item.id === itemIdToRemove);

        if (itemIndexToRemove !== -1) {
            products.splice(itemIndexToRemove, 1);
            localStorage.setItem("data", JSON.stringify(products));
            displayCart();
            displayTotal();
        }
    }
});


function showPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 3000);
}


function displayTotal() {
    const totalElement = document.getElementById('total');
    let totalPrice = 0;
    products.forEach(product => {
        totalPrice += parseFloat(product.price); 
    });
    totalElement.textContent = `Total: Rs.${totalPrice.toFixed(2)}`;
}

function updateQuantity() {
    const quantityInputs = document.querySelectorAll('.quantity input');
    quantityInputs.forEach((input, index) => {
        input.addEventListener('change', () => {
            const newQuantity = parseInt(input.value);
            if (newQuantity > 0) {
                products[index].price = newQuantity * parseFloat(products[index].unitPrice); 
                localStorage.setItem("data", JSON.stringify(products)); 
                displayTotal();
            } else {
                
                products.splice(index, 1);
                localStorage.setItem("data", JSON.stringify(products)); 
                displayCart(); 
                displayTotal();
            }
        });
    });
}
