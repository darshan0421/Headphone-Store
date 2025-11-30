const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content p", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__image__content ", {
  duration: 1000,
  delay: 1500,
});

ScrollReveal().reveal(".product__image img", {
  ...scrollRevealOption,
  origin: "left",
});
ScrollReveal().reveal(".product__card", {
  ...scrollRevealOption,
  delay: 500,
  interval: 500,
});

const swiper = new Swiper(".swiper", {
  loop: true,
  effect: "coverflow",
  grabCursor: true,
  centerSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 0,
    depth: 250,
    modifier: 1,
    scale: 0.75,
    slideShadows: false,
    stretch: -100,
  },

  pagination: {
    el: ".swiper-pagination",
  },
});

// Auth State Management
const token = localStorage.getItem('token');
const authLinks = document.getElementById('authLinks');
const userLinks = document.getElementById('userLinks');
const logoutBtn = document.getElementById('logoutBtn');

if (token) {
  if (authLinks) authLinks.style.display = 'none';
  if (userLinks) userLinks.style.display = 'flex';
  if (userLinks) userLinks.style.alignItems = 'center';
  if (userLinks) userLinks.style.gap = '1rem';
} else {
  if (authLinks) authLinks.style.display = 'flex';
  if (authLinks) authLinks.style.alignItems = 'center';
  if (authLinks) authLinks.style.gap = '1rem';
  if (userLinks) userLinks.style.display = 'none';
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  });
}

// Add to Cart Logic
async function initializeProducts() {
  try {
    // Seed products first (idempotent)
    await fetch('/api/products/seed');

    // Fetch products
    const response = await fetch('/api/products');
    const products = await response.json();

    // Map products to buttons (Simple mapping for demo)
    const addToCartBtns = document.querySelectorAll('.btn');

    addToCartBtns.forEach((btn, index) => {
      if (btn.innerText === 'Add to cart') {
        btn.addEventListener('click', async () => {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('Please login to add items to cart');
            window.location.href = 'login.html';
            return;
          }

          // Pick a product based on context. 
          let productToAdd;
          if (btn.closest('.header__image__content')) {
            productToAdd = products[0];
          } else if (btn.closest('.product__btn')) {
            productToAdd = products[1]; // Just an example
          } else {
            productToAdd = products[0]; // Fallback
          }

          if (!productToAdd) {
            alert('Product not found');
            return;
          }

          try {
            const res = await fetch('/api/cart/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              body: JSON.stringify({ productId: productToAdd._id, quantity: 1 })
            });

            if (res.ok) {
              alert(`${productToAdd.name} added to cart!`);
            } else {
              alert('Failed to add to cart');
            }
          } catch (error) {
            console.error(error);
          }
        });
      }
    });

  } catch (error) {
    console.error('Failed to initialize products:', error);
  }
}

initializeProducts();
