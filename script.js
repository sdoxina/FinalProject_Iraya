document.addEventListener('DOMContentLoaded', function () {
    const products = document.querySelectorAll(".ps-product");

    const filters = {
        availability: "all",
        minPrice: 0,
        maxPrice: Infinity,
        productCategory: "all",
        sortBy: "best-selling",
    };

    function filterProducts() {
        products.forEach(product => {
            const availability = product.dataset.availability;
            const price = parseFloat(product.dataset.price);
            const productCategory = product.dataset.productCategory;

            let show = true;

            if (filters.availability !== "all" && filters.availability !== availability) {
                show = false;
            }

            if (price < filters.minPrice || price > filters.maxPrice) {
                show = false;
            }

            if (filters.productCategory !== "all" && filters.productCategory !== productCategory) {
                show = false;
            }

            product.style.display = show ? "block" : "none";
        });

        updateResultCount();
    }

    function sortProducts() {
        const container = document.querySelector(".product-grid");
        const sortedProducts = Array.from(products).sort((a, b) => {
            const aValue = getSortValue(a);
            const bValue = getSortValue(b);

            switch (filters.sortBy) {
                case "best-selling":
                    return 0;
                case "title-az":
                    return aValue.localeCompare(bValue);
                case "title-za":
                    return bValue.localeCompare(aValue);
                case "price-low-high":
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case "price-high-low":
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                default:
                    return 0;
            }
        });

        container.innerHTML = "";
        sortedProducts.forEach(product => container.appendChild(product));
    }

    function getSortValue(product) {
        switch (filters.sortBy) {
            case "best-selling":
                return "best-selling";
            case "title-az":
            case "title-za":
                return product.querySelector(".ps-title").innerText.trim().toLowerCase();
            case "price-low-high":
            case "price-high-low":
                return parseFloat(product.dataset.price);
            default:
                return "";
        }
    }

    function updateResultCount() {
        const visibleProducts = Array.from(products).filter(product => product.style.display !== "none").length;
        const resultsText = document.querySelector("#priceRangeDropdownButton + .dropdown-menu .results-text");
        resultsText.textContent = `Showing ${visibleProducts} product${visibleProducts !== 1 ? 's' : ''}`;
    }

    document.getElementById("apply-price-filter").addEventListener("click", function (e) {
        e.preventDefault();
        applyPriceRangeFilter();
    });

    document.querySelector(".clear-price-filter").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("min-price").value = "";
        document.getElementById("max-price").value = "";
        filters.minPrice = 0;
        filters.maxPrice = Infinity;
        filterProducts();
    });

    document.getElementById("min-price").addEventListener("input", function (e) {
        filters.minPrice = parseFloat(e.target.value) || 0;
        filterProducts();
    });

    document.getElementById("max-price").addEventListener("input", function (e) {
        filters.maxPrice = parseFloat(e.target.value) || Infinity;
        filterProducts();
    });

    document.getElementById("availabilityDropdownButton").addEventListener("click", function (e) {
        e.preventDefault();
    });

    document.querySelectorAll("#availabilityDropdownButton + .dropdown-menu .dropdown-item").forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            filters.availability = this.getAttribute('data-filter');
            filterProducts();
        });
    });

    document.getElementById("categoryDropdownButton").addEventListener("click", function (e) {
        e.preventDefault();
    });

    document.querySelectorAll("#categoryDropdownButton + .dropdown-menu .dropdown-item").forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            filters.productCategory = this.getAttribute('data-filter');
            filterProducts();
        });
    });

    document.getElementById("sortDropdownButton").addEventListener("click", function (e) {
        e.preventDefault();
    });

    document.querySelectorAll("#sortDropdownButton + .dropdown-menu .dropdown-item").forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            filters.sortBy = this.getAttribute('data-sort');
            sortProducts();
        });
    });

    filterProducts();
    sortProducts();

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').textContent = cartCount;
    }

    function addToCart(product) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productId = product.querySelector('.ps-title').innerText.trim();
        const productPrice = parseFloat(product.querySelector('.ps-price').innerText.replace('₱', '').trim());
        const productImage = product.querySelector('.ps-img').src;
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ id: productId, price: productPrice, quantity: 1, image: productImage });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    products.forEach(product => {
        product.querySelector('.add-to-cart').addEventListener('click', function () {
            addToCart(product);
        });
    });

    updateCartCount();
});
