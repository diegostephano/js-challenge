const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://api.escuelajs.co/api/v1/products';
let offset = 5,
  limit = 10
  
  const getData = async (api) => {

  localStorage.setItem('pagination', offset);
  let pagination = localStorage.getItem('pagination');

  await fetch(api+`?offset=${pagination}&limit=${limit}`)
    .then(response => response.json())
    .then(response => {
      let products = response;
      console.log(products);
      let output = products.map(product => {
        // template
        return `
        <article class="Card">
          <img loading="lazy" alt="${product.description}" src="${product.category.image}" />
          <h2>
            ${product.title}
            <small>$ ${product.price}</small>
          </h2>
        </article>`;
      });
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
      //Implementar mensaje: "Todos los productos Obtenidos".
      if(response.length < 10){
        $observe.innerHTML = `<h1> Todos los productos Obtenidos </h1> `;
        intersectionObserver.disconnect()
      }
    })
    .catch(error => console.log(error));
    
  offset += limit;
}

//Actualiza la función loadData() a Async/Await
const loadData = async () => {
  await getData(API);
}

const intersectionObserver = new IntersectionObserver(entries => {
  //Guarda en localStorage la posición inicial ("pagination") y actualízala en cada petición nueva para traer los siguientes productos
  if (entries[0].isIntersecting){loadData()}
}, {
  rootMargin: '0px 0px 100% 0px',
});

window.onbeforeunload = function(){
  localStorage.clear();
};

intersectionObserver.observe($observe);
