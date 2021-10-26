// Show Menu
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

    if(toggle && nav){
        toggle.addEventListener('click', () =>{
            nav.classList.toggle('show');
        });
    };
};


showMenu('nav-toggle', 'nav-menu');



//Remove Menu
const navLink = document.querySelectorAll('.nav__link'),
navMenu = document.getElementById('nav-menu');

function linkAction(){
    navMenu.classList.remove('show');
};
navLink.forEach(n => n.addEventListener('click',linkAction));


//Scroll sections and active link
const sections = document.querySelectorAll('section[id]')

window.addEventListener('scroll', scrollActive);

function scrollActive(){
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id');


        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active');
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active') ;
        }

    
    });
};


//Change Header Color
window.onscroll = () =>{
    const nav = document.getElementById('header');
    if(this.scroll >= 200) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header');
};    



                                   // CART

                           

//SHOW CART MENU
(function(){
    const cartInfo = document.getElementById('cart-info')
    const cart = document.getElementById('cart')

    cartInfo.addEventListener('click', function(){
        cart.classList.toggle('show-cart')
    })

    
})();


    
// ADD ITEM TO CART

(function(){
    const cartBtn = document.querySelectorAll('.button-light');
    //console.log(cartBtn)
    
    cartBtn.forEach(function(btn){
        btn.addEventListener('click', function(event){
       
         if(event.target){

           

            // SMALLER-IMAGE ADDED ON TO CART WHEN BUTTON IS CLICKED
             let fullPath = event.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.src
             let pos = fullPath.indexOf('Img')+3
             let particalPath = fullPath.slice(pos)
             //console.log(particalPath)


             const item = {};
             item.img = `Img Cart${particalPath}`;



             //NAME OF ITEM
             let name = event.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent
             item.name = name
             

             //PRODUCT DESCRIPTION
             let productDescription = event.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent
             item.productDescription = productDescription

              //COLOR OF ITEM
              let color = event.target.previousElementSibling.previousElementSibling.value
              item.color = color


             //PRICE OF ITEM
             let price = event.target.previousElementSibling.textContent
             let finalPrice = price.slice(1).trim()
             item.finalPrice= finalPrice

            
           // console.log(item)

             const cartItem = document.createElement('div')
             cartItem.classList.add('cart__item')

             //TEMPLATE
             cartItem.innerHTML =  `
            <img src="${item.img}" class="item__img" id="item-img" alt="">
        <div class="item__text" id="item-text">
            <p class="product__name" id="cart-item-name">${item.name}</p>
            <span class="product__description" id="cart-item-description">${item.productDescription}</span><br>
            <option class="product__value" id="cart-item-value" value="Feminist">${item.color}</option>
            <input class="product__quantity" id="cart-item-quantity" type="number" value="1">
            <span class="product__cartprice">R </span><span class="product__cartprice" id="cart-item-price">${item.finalPrice}</span>
            <span href="#" class="item__remove" id="cart-item-remove"><i class="bx bxs-trash-alt"></i></span>
                `  ;  

            //SELECT CART
            const cart = document.getElementById('cart');
            const total = document.querySelector('.cart-total__container');

            cart.insertBefore(cartItem, total);

        
         //QUANTITY 

         var quantityInputs = document.getElementsByClassName('product__quantity')
         for (var i = 0; i < quantityInputs.length; i++) {
            var input = quantityInputs[i]
            input.addEventListener('change', function(event){
                var quantInput = event.target
                if (isNaN( quantInput.value) ||  quantInput.value <= 0) {
                    quantInput.value = 1
                }
                showTotals()
            })
         }
        

        

        //REMOVE ITEM FROM CART
        var removeBtn = document.getElementsByClassName("item__remove")

     

        for( var i = 0; i < removeBtn.length; i++){
            var buttons = removeBtn[i]
             buttons.addEventListener('click', function(event){
             var buttonClicked = event.target
            buttonClicked.parentElement.parentElement.parentElement.remove() 
            showTotals()
          
            })         
         }
         showTotals()
         }

      });
    });

    //SHOW TOTALS
    function showTotals(){
        const total = [];
        const items = document.querySelectorAll('#cart-item-price');
        const quantityElement = document.getElementsByClassName('product__quantity')[0]
        const quantity = quantityElement.value

        //console.log(quantityElement)
        //console.log(items)
        console.log(quantity)


        items.forEach(function(item){
            total.push(parseFloat(item.textContent))
        })

        //console.log(total)
   

        const totalMoney = total.reduce(function(total, item){
            total += item;
            return total;
        }, 0)

        const finalMoney = quantity * totalMoney.toFixed(2)
        //console.log(finalMoney)

       document.getElementById('cart-total').textContent = finalMoney;
       document.getElementById('item-total').textContent = finalMoney;
       document.getElementById('item-count').textContent = total.length;

       
    };


    
})();

var yoco = new window.YocoSDK({
    key: yocoPublicKey
})

var checkoutButton = document.querySelector('#checkout-button')
checkoutButton.addEventListener('click', function (){
    var priceElement = document.getElementsByClassName('cart__total')[0];
    var price = parseFloat(priceElement.textContent.replace('R','')) * 100

    console.log(price)

    yoco.showPopup({
        currency: 'ZAR',
        amountInCents: price, 
        name: 'Black Girl Supply Payment',
        locale: 'auto',

        callback: response => {
            if(response.error){
                $('.popup p').html(response.error.message);
                }
                   else {
                      
                    fetch('/pay', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ 
                            token: response.id
                         })
                        })
                    .then(res => res.json())
                    .then(data => {
                        if(data.errorCode){
                            $('.popup p').html(data.displayMessage);
                        }
                        else{
                            $('.popup p').html(data.status);
                        }
                    })
                    .catch(error => {
                        $('.popup p').html(error.message);
                    })

            }
        }

    })
})