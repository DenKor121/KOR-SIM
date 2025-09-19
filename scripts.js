document.addEventListener('DOMContentLoaded', function () {
  let cart = document.querySelector('.cart');
  let overlay = document.querySelector('.cart-overlay');
  let cartIcon = document.querySelector('.header-icons img[alt="basket"]');
  let closeBtn = document.querySelector('.close-cart');
  let addBtns = document.querySelectorAll('.product-btn');
  let itemsBox = document.querySelector('.cart-items');
  let totalEl = document.querySelector('.cart-total');

  let cartItems = [];

  // --- Открыть/Закрыть корзину ---
  function openCart() {
    cart.classList.add('active');
    overlay.classList.add('active');
  }

  function closeCart() {
    cart.classList.remove('active');
    overlay.classList.remove('active');
  }

  if (cartIcon) cartIcon.addEventListener('click', openCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);

  // --- Парсинг цены ---
  function parsePrice(priceText) {
    if (!priceText) return 0;

    let txt = priceText.replace("€", "").trim();
    txt = txt.replace(/\s/g, "");

    // если есть и точка, и запятая → точка = тысячи, запятая = копейки
    if (txt.includes(",") && txt.includes(".")) {
      txt = txt.replace(/\./g, "");  // убираем все точки (разделители тысяч)
      txt = txt.replace(",", ".");   // запятую делаем десятичной
    } else {
      txt = txt.replace(",", ".");   // если только запятая — превращаем в точку
    }

    let num = parseFloat(txt);
    if (isNaN(num)) num = 0;
    return num;
  }

  // --- Добавление в корзину ---
  for (let i = 0; i < addBtns.length; i++) {
    addBtns[i].addEventListener('click', function () {
      let card = addBtns[i].closest('.product-card');
      let titleEl = card.querySelector('.product-title');
      let priceEl = card.querySelector('.product-price');
      let imgEl = card.querySelector('img');

      let title = titleEl ? titleEl.innerText : "Product";
      let priceText = priceEl ? priceEl.innerText : "€0.00";
      let imgSrc = imgEl ? imgEl.src : "";

      let priceNum = parsePrice(priceText);

      // проверяем есть ли уже в корзине
      let found = false;
      for (let k = 0; k < cartItems.length; k++) {
        if (cartItems[k].title === title) {
          cartItems[k].quantity += 1;
          found = true;
          break;
        }
      }

      if (!found) {
        cartItems.push({
          title: title,
          priceNum: priceNum,
          img: imgSrc,
          quantity: 1
        });
      }

      render();
      openCart();
    });
  }

  // --- Отрисовка корзины ---
  function render() {
    itemsBox.innerHTML = "";
    let total = 0;

    for (let i = 0; i < cartItems.length; i++) {
      let item = cartItems[i];
      total += item.priceNum * item.quantity;

      let row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML =
        '<img src="' + item.img + '" alt="">' +
        '<div class="cart-item-info">' +
        '<p class="cart-item-title">' + item.title + '</p>' +
        '<p class="cart-item-price">€' + item.priceNum.toFixed(2) + '</p>' +
        '<div class="quantity-controls">' +
        '<button class="dec" data-i="' + i + '">-</button>' +
        '<span>' + item.quantity + '</span>' +
        '<button class="inc" data-i="' + i + '">+</button>' +
        '</div>' +
        '</div>' +
        '<button class="remove-btn" data-i="' + i + '">✖</button>';

      itemsBox.appendChild(row);
    }

    totalEl.innerText = "€" + total.toFixed(2);

    let incBtns = itemsBox.querySelectorAll('.inc');
    let decBtns = itemsBox.querySelectorAll('.dec');
    let remBtns = itemsBox.querySelectorAll('.remove-btn');

    for (let i = 0; i < incBtns.length; i++) {
      incBtns[i].addEventListener('click', function () {
        let index = parseInt(incBtns[i].dataset.i);
        cartItems[index].quantity++;
        render();
      });
    }

    for (let i = 0; i < decBtns.length; i++) {
      decBtns[i].addEventListener('click', function () {
        let index = parseInt(decBtns[i].dataset.i);
        if (cartItems[index].quantity > 1) {
          cartItems[index].quantity--;
        } else {
          cartItems.splice(index, 1);
        }
        render();
      });
    }

    for (let i = 0; i < remBtns.length; i++) {
      remBtns[i].addEventListener('click', function () {
        let index = parseInt(remBtns[i].dataset.i);
        cartItems.splice(index, 1);
        render();
      });
    }
  }

  // --- Checkout Modal ---
  let checkoutBtn = document.querySelector('.checkout-btn');
  let checkoutModal = document.querySelector('.checkout-modal');
  let closeCheckout = document.querySelector('.close-checkout');
  let backToCartBtn = document.querySelector('.back-to-cart');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      closeCart(); // закрыть корзину
      checkoutModal.classList.add('active'); // открыть окно checkout
    });
  }

  if (closeCheckout) {
    closeCheckout.addEventListener('click', function () {
      checkoutModal.classList.remove('active');
    });
  }

  if (backToCartBtn) {
    backToCartBtn.addEventListener('click', function () {
      checkoutModal.classList.remove('active');
      openCart(); // возвращаем обратно корзину
    });
  }
});