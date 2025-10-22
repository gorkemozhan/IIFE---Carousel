(() => {   
  if (window.location.href == "https://www.e-bebek.com/") { 
   

    const init = () => { 
      buildHTML();
      buildCSS();
      fetchItems();
      setEvents();
    };

    const buildHTML = () => {   
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
      
    };

    const buildCSS = () => { 
        

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
      const style = document.createElement("style");  
      style.innerHTML = css;
      document.head.appendChild(style);
    };

    const fetchItems = () => { 
        
      const storedProducts = localStorage.getItem("storedProducts");

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

        if (product.original_price == product.price) { 
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





    const kalpler = document.querySelectorAll(".heart");

    let favoriler = JSON.parse(localStorage.getItem("favoriler")) || [];

    kalpler.forEach((kalp, index) => {
        if (favoriler.includes(index)) {
        kalp.textContent = "♥";
    }

    kalp.addEventListener("click", () => {
        if (favoriler.includes(index)) {
            favoriler.splice(favoriler.indexOf(index), 1); 
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
