
// Get DOM elements
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.header');
const currentYearSpans = document.querySelectorAll('#current-year');

// Set current year in footer
currentYearSpans.forEach(span => {
  span.textContent = new Date().getFullYear();
});

// Toggle mobile menu
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Toggle animation for hamburger menu
    const spans = menuToggle.querySelectorAll('span');
    spans.forEach(span => {
      span.classList.toggle('active');
    });
  });
}

// Change header background on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Product data for shop page
const products = [
  {
    id: 1,
    name: "Roti Goreng Lumer",
    price: 5000,
    description: "Roti Goreng Lumer Dengan Varian Rasa Yang Meletup",
    image: "public/logo.jpg",
    category: "bread",
    popular: true
  },
  {
    id: 8,
    name: "Cake Lava Lumer",
    price: 10000,
    description: "Cake Lava Lumernya Enggak Pelit!",
    image: "public/logo.jpg",
    category: "bread"
  }
];

// Load products on shop page
const productsContainer = document.getElementById('products-container');
const categoryFilter = document.getElementById('category');
const sortFilter = document.getElementById('sort');

// Function to render products
function renderProducts(productsToRender) {
  if (!productsContainer) return;
  
  productsContainer.innerHTML = '';
  
  productsToRender.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        ${product.popular ? '<span class="badge">Populer</span>' : ''}
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">Rp ${product.price.toLocaleString()}</p>
        <p class="description">${product.description}</p>
        <button class="btn btn-secondary">Tambahkan ke Keranjang</button>
      </div>
    `;
    
    productsContainer.appendChild(productCard);
  });
}

// Filter and sort products
function filterAndSortProducts() {
  if (!productsContainer) return;
  
  const category = categoryFilter.value;
  const sortOption = sortFilter.value;
  
  // Filter by category
  let filteredProducts = category === 'all' 
    ? [...products] 
    : products.filter(product => product.category === category);
  
  // Sort products
  switch (sortOption) {
    case 'name-asc':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    default:
      break;
  }
  
  renderProducts(filteredProducts);
}

// Initialize shop page
if (productsContainer) {
  // Initial render
  renderProducts(products);
  
  // Add event listeners for filters
  categoryFilter.addEventListener('change', filterAndSortProducts);
  sortFilter.addEventListener('change', filterAndSortProducts);
}

// Contact form handling
const contactForm = document.getElementById('contactForm');
const name = document.getElementById('name');
const pesan = document.getElementById('massage');
const nomorHp = document.getElementById('phone');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // In a real application, you would send the form data to a server
    // For this example, we'll just show an alert
    
const contactForm = document.getElementById('contactForm');
const name = document.getElementById('name');
const msg = document.getElementById('message');
const nomorHp = document.getElementById('phone');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const nomor = "6282113790783"; // Ganti dengan nomor WhatsApp tujuan, awali dengan kode negara (62)
    const namaPengirim = name.value.trim();
    const pesan = msg.value.trim()

    const fullMessage = `Halo, nama saya ${namaPengirim}.\n${pesan}`;
    const waURL = `https://wa.me/${nomor}?text=${encodeURIComponent(fullMessage)}`;

    // Buka link WhatsApp
    window.open(waURL, '_blank');

    alert('Mengalihkan ke WhatsApp...');
    contactForm.reset();
  });
}

  });
}



