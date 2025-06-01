
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

// Product data for shop page with toppings
const products = [
  {
    id: 1,
    name: "Roti Coklat",
    price: 5000,
    description: "Roti batu",
    image: "public/rotiCoklat.jpg",
    category: "bread",
    popular: true,   
    toppings: [
      { name: "Coklat ", price: 0 },
      { name: "Matcha", price: 0}
    ]
  },
  {
    id: 1,
    name: "Roti Lumer",
    price: 10000,
    description: "Roti batu",
    image: "public/rotiLumerr.jpg",
    category: "bread",
    popular: true,
    toppings: [
      { name: "Oreo", price: 0 },
      { name: "Keju", price: 0 },
      { name: "ChocoChips", price: 0}
    ]
  }
];

// Load products on shop page
const productsContainer = document.getElementById('products-container');
const categoryFilter = document.getElementById('category');
const sortFilter = document.getElementById('sort');

// Modal elements
let currentProduct = null;

// Function to create product modal
function createProductModal(product) {
  const modal = document.createElement('div');
  modal.className = 'product-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${product.name}</h3>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <img src="${product.image}" alt="${product.name}" class="modal-image">
        <p class="modal-description">${product.description}</p>
        <p class="modal-price">Harga Dasar: Rp ${product.price.toLocaleString()}</p>
        
        <div class="quantity-section">
          <label for="quantity">Jumlah:</label>
          <div class="quantity-controls">
            <button type="button" class="qty-btn minus">-</button>
            <input type="number" id="quantity" value="1" min="1" max="99">
            <button type="button" class="qty-btn plus">+</button>
          </div>
        </div>

        <div class="toppings-section">
          <h4>Pilih Topping:</h4>
          <div class="toppings-list">
            ${product.toppings.map(topping => `
              <label class="topping-item">
                <input type="checkbox" name="topping" value="${topping.name}" data-price="${topping.price}">
                <span class="topping-name">${topping.name}</span>
                <span class="topping-price">+Rp ${topping.price.toLocaleString()}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="total-section">
          <h4>Total: <span id="total-price">Rp ${product.price.toLocaleString()}</span></h4>
        </div>

        <div class="customer-info">
          <h4>Informasi Pelanggan:</h4>
          <input type="text" id="customer-name" placeholder="Nama Lengkap" required>
          <input type="text" id="customer-class" placeholder="Kelas (contoh: X DKV 1)" required>
          <textarea id="customer-notes" placeholder="Catatan tambahan (opsional)" rows="3"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Batal</button>
        <button class="btn btn-primary" onclick="orderViaWhatsApp()">Pesan via WhatsApp</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  setupModalEventListeners(modal, product);
  
  return modal;
}

function setupModalEventListeners(modal, product) {
  // Close modal events
  modal.querySelector('.close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Quantity controls
  const quantityInput = modal.querySelector('#quantity');
  const minusBtn = modal.querySelector('.minus');
  const plusBtn = modal.querySelector('.plus');

  minusBtn.addEventListener('click', () => {
    if (quantityInput.value > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
      updateTotalPrice(product);
    }
  });

  plusBtn.addEventListener('click', () => {
    if (quantityInput.value < 99) {
      quantityInput.value = parseInt(quantityInput.value) + 1;
      updateTotalPrice(product);
    }
  });

  quantityInput.addEventListener('input', () => updateTotalPrice(product));

  // Topping checkboxes
  const toppingCheckboxes = modal.querySelectorAll('input[name="topping"]');
  toppingCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => updateTotalPrice(product));
  });
}

function updateTotalPrice(product) {
  const modal = document.querySelector('.product-modal');
  const quantity = parseInt(modal.querySelector('#quantity').value) || 1;
  const selectedToppings = modal.querySelectorAll('input[name="topping"]:checked');
  
  let basePrice = product.price;
  let toppingPrice = 0;
  
  selectedToppings.forEach(topping => {
    toppingPrice += parseInt(topping.dataset.price);
  });
  
  const totalPrice = (basePrice + toppingPrice) * quantity;
  modal.querySelector('#total-price').textContent = `Rp ${totalPrice.toLocaleString()}`;
}

function openProductModal(product) {
  currentProduct = product;
  const modal = createProductModal(product);
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.querySelector('.product-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = 'auto';
    currentProduct = null;
  }
}

function orderViaWhatsApp() {
  const modal = document.querySelector('.product-modal');
  const customerName = modal.querySelector('#customer-name').value.trim();
  const customerPhone = modal.querySelector('#customer-class').value.trim();
  const customerNotes = modal.querySelector('#customer-notes').value.trim();
  const quantity = parseInt(modal.querySelector('#quantity').value);
  const selectedToppings = modal.querySelectorAll('input[name="topping"]:checked');
  
  // Validation
  if (!customerName || !customerPhone) {
    alert('Harap isi nama dan nomor WhatsApp!');
    return;
  }

  // Build order message
  let message = `🍞 *PESANAN ROTI LEZAT* 🍞\n\n`;
  message += `👤 *Nama:* ${customerName}\n`;
  message += `📱 *kelas:* ${customerPhone}\n\n`;
  message += `🛒 *Detail Pesanan:*\n`;
  message += `• ${currentProduct.name} x${quantity}\n`;
  message += `  Harga: Rp ${currentProduct.price.toLocaleString()} per item\n`;
  
  if (selectedToppings.length > 0) {
    message += `\n🍯 *Topping yang dipilih:*\n`;
    selectedToppings.forEach(topping => {
      message += `• ${topping.value} (+Rp ${parseInt(topping.dataset.price).toLocaleString()})\n`;
    });
  }
  
  // Calculate total
  let toppingPrice = 0;
  selectedToppings.forEach(topping => {
    toppingPrice += parseInt(topping.dataset.price);
  });
  const totalPrice = (currentProduct.price + toppingPrice) * quantity;
  
  message += `\n💰 *Total Harga:* Rp ${totalPrice.toLocaleString()}\n`;
  
  if (customerNotes) {
    message += `\n📝 *Catatan:* ${customerNotes}\n`;
  }
  
  message += `\n🕒 Pesanan dikirim pada: ${new Date().toLocaleString('id-ID')}\n`;
  message += `\nTerima kasih telah memesan di Roti Lezat! 😊`;
  
  const whatsappNumber = '6282113790783';
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  alert('Pesan Anda telah dikirim! Kami akan menghubungi Anda segera.');
  window.open(whatsappURL, '_blank');
  
  closeModal();
}

// nampilin produk
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
        <div class="toppings-preview">
          <small>Topping tersedia: ${product.toppings.length} pilihan</small>
        </div>
        <button class="btn btn-secondary" onclick="openProductModal(${JSON.stringify(product).replace(/"/g, '&quot;')})">Pesan Sekarang</button>
      </div>
    `;
    
    productsContainer.appendChild(productCard);
  });
}

// filter produk
function filterAndSortProducts() {
  if (!productsContainer) return;
  
  const category = categoryFilter.value;
  const sortOption = sortFilter.value;
  
  // filter sesuai kategori
  let filteredProducts = category === 'all' 
    ? [...products] 
    : products.filter(product => product.category === category);
  

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

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    alert('Pesan Anda telah dikirim! Kami akan menghubungi Anda segera.');
    contactForm.reset();
  });
}

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});