/* 
-> Yorum satırlarında yapım aşamasında bilmediğim konuları araştırdığım kaynakların linklerini bırakıyorum
-> Süre kısıtlı olduğu için CSS'i sona bırakmıştım UI olarak biraz zayıf olabilir ve yine aynı sebepten readme dosyası oluşturamadım bunlar dışında istenen maddelerin hepsi çalışıyor.
-> DOM için https://www-w3schools-com.translate.goog/js/js_htmldom_elements.asp?_x_tr_sl=en&_x_tr_tl=tr&_x_tr_hl=tr&_x_tr_pto=tc
-> Teşekkürler, Bekir Görkem Özhan
*/

(() => {   // Öncelikle bu şekil dosyaların IIFE diye geçtiklerini öğrendim. Normalde önceden hep html içine js gömüp çalışmıştım. Güzel bir tecrübe oldu.
  if (window.location.href == "https://www.e-bebek.com/") { 
    /* 
        ->Pdfteki 3. madde:
        ->You code should only run in homepage, if user is on any other page you need to console.log “wrong page”.
        ->https://stackoverflow.com/questions/28394649/check-if-homepage-using-window-location
    */

    const init = () => { // Fonksiyonları initialize ettiğim yer.
      buildHTML();
      buildCSS();
      fetchItems();
      setEvents();
    };

    const buildHTML = () => {   // Temel HTML iskeleteni oluşturduğum yer ve Title of the carousel should be “Beğenebileceğinizi düşündüklerimiz” bu taskı yaptığım yer.
      const html = `
        <div class="container">
        <h1 class="title">Beğenebileceğinizi düşündüklerimiz</h1>
            <div class="carousel">
              <button class="btn-backward">&#10094;</button> 
              <div class="items"></div>
              <button class="btn-forward">&#10095;</button>
          </div>
        </div>
      `;
      
  document.querySelector('eb-product-carousel').insertAdjacentHTML("beforeend", html);     
      // https://stackoverflow.com/questions/13495010/how-to-add-content-to-html-body-using-js
      // PDFte istenilen yere koymak için siteye girip console'a girip elementin taglerine baktım
    };

    const buildCSS = () => { 
        /* 
            -> CSS kısmı için takıldığım yerlerde w3schoolstan yardım aldım. bazı baktığım linkler:
            -> https://www.w3schools.com/cssref/css_colors.php
            -> https://www.w3schools.com/css/tryit.asp?filename=trycss_border_round 

        */

      const css = `
        .container {
            width: 100%;
            border: 2px solid gray;
            border-radius: 12px;
        }

        .title {

            align-content: center;
            color: orange;
            background-color: AntiqueWhite;
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            border: 2px solid AntiqueWhite ;
            padding: 10px;
            border-radius: 12px;
            
        }

        .carousel {
            display: flex;
            align-items: center;
            justify-content: center;
             position: relative; 
        }

        .items {
            display: flex; overflow-x: auto; scroll-behavior: smooth;
        }


        .card {
            flex: 0 0 auto;
            width: 180px;
            border: 2px solid gray;
            border-radius: 5px;
            background: white;
            text-align: center;
            margin: 5px;
            padding: 10px;
            justify-content: space-between;
        }

        .card:hover {
            transform: scale(1.05);
        }

        .card img {
            width: 100%;
            height: 150px;
            object-fit: contain;
        }

        .btn-backward, .btn-forward {
            font-size: 30px;
            color: gray;
            background: none;
            border: none;
            z-index: 9999;
        }

        .btn-backward:hover, .btn-forward:hover {
            color: black;
        }


        .product-link {
            color:black;
        }
        
        .product-link:hover {
            color: orange;
        }

        .heart {
        border: 1px solid gray;
        border-radius: 50%;
        paddding: 5px;
        position: absolute;
        top: 8px;
        right: 10px;
        font-size: 22px;
        color: orange;
        }

        .heart:hover {
            transform: scale(1.2);
        }

      `;
      const style = document.createElement("style");   // https://medium.com/@vaibhav_55744/how-to-append-css-strings-dynamically-via-javascript-30c4ed4b6cf3
      style.innerHTML = css;
      document.head.appendChild(style);
    };

    const fetchItems = () => { 
        /*
         Fetch the product list from this link sending a GET request:
         https://www.youtube.com/watch?v=37vxWr0WgQk  vanilla js APIden veri çekme için yararlandığım kaynak
         
         It should retrieve the product list from local storage rather than sending a new fetch request:
         https://www.youtube.com/watch?v=F8oXuv_vyHE  vanilla js localStorage kullanımı için yararlandığım kaynak   
        */
      const storedProducts = localStorage.getItem("storedProducts");

        // https://stackoverflow.com/questions/16010827/html5-localstorage-checking-if-a-key-exists localStorage'ın boş olup olmadığını nasıl kontrol ederim kısmı
      if (storedProducts == null) {
        fetch("https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json",
            {method:"GET"}
        )
          .then(response => response.json())
          .then(data => {
            showItems(data);
            localStorage.setItem("storedProducts", JSON.stringify(data));
          })
          .catch(error => console.error(error));
      } else {
        const data = JSON.parse(storedProducts);
        showItems(data);
      }
    };

    const showItems = (data) => {
      const itemContainer = document.querySelector(".items");
      itemContainer.innerHTML = "";

      data.forEach(product => {
        let priceDiffHTML = "";

        if (product.original_price == product.price) { // If “price” and “original_price” are different, show both price like in the example and also calculate the discount amount and show it as well.
          priceDiffHTML = `<p style="font-size: 25px">${product.original_price}TL</p>`;
        } else {
          const discountPercent = Math.round(100 - ((product.price * 100) / product.original_price));
          priceDiffHTML = `
            <div style="display: flex; align-items: center; font-size: 25px; ">
            <p style="text-decoration: line-through; color: gray;">${product.original_price}TL</p>
            <p style="margin-left: 10px; color: green" >%${discountPercent}</p>
            </div>
            <p style="font-size:25px; color: green; ">${product.price}</p>
          `;
        }

        const card = document.createElement("div");
        card.className = "card";

        // When a user clicks on a product, the respective product page should open in a new tab. <a></a> taginin içinde
        card.innerHTML = `
          
          <img src="${product.img}">
          <span class="heart">♡</span>
          
          <div style="margin-top: 10px">
          <a href="${product.url}" target="_blank"><p class="product-link"><b>${product.brand}</b> - ${product.name}</p></a> 
          </div>
        
          <div style="margin-top:10px">
          ${priceDiffHTML}
          </div>

          <div style="margin-top: 10px">
          <p style="color:green; border: 2px solid; border-radius: 12px;">Farklı Ürünlerde 3 Al 2 Öde</p>
          <button style="color:orange; border: 2px solid; border-radius: 12px; justify-content: center; text-align: center; padding: 10px; background-color:AntiqueWhite ">Sepete Ekle</button>
          </div>
        `;



/*
When user clicks on the heart icon should fill it with orange color, and this
preference should be stored in the local storage in an array.
Products marked as favorites before are displayed with filled heart icons.

js localstorage toggle -> https://www.google.com/search?q=js+localstorage+toggle
*/

    const kalpler = document.querySelectorAll(".heart");

    let favoriler = JSON.parse(localStorage.getItem("favoriler")) || [];

    kalpler.forEach((kalp, index) => {
        if (favoriler.includes(index)) {
        kalp.textContent = "♥";
    }

    kalp.addEventListener("click", () => {
        if (favoriler.includes(index)) {
            favoriler.splice(favoriler.indexOf(index), 1);  // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
            kalp.textContent = "♡";
        } else {
            favoriler.push(index);
            kalp.textContent = "♥";
        }

    localStorage.setItem("favoriler", JSON.stringify(favoriler));
  });
});

    

        itemContainer.appendChild(card);
      });
    };

    const setEvents = () => {
      const itemContainer = document.querySelector(".items");
      const backBtn = document.querySelector(".btn-backward");
      const forBtn = document.querySelector(".btn-forward");


      // Carousel buton ile kaydırma kısmında yararlandığım kaynak: https://webdesign.tutsplus.com/how-to-build-a-simple-carousel-with-vanilla-javascript--cms-41734t

      forBtn.addEventListener("click", () => {
        itemContainer.scrollLeft += itemContainer.clientWidth;
      });

      backBtn.addEventListener("click", () => {
        itemContainer.scrollLeft -= itemContainer.clientWidth;
      });

    };

    init();

  } else {
    console.log("wrong page");
  }
})();
