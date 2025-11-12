document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS ---
    const closetItemsContainer = document.querySelector('#closetItemsContainer'); // Corrected to use ID
    const filterButtons = document.querySelectorAll('.category-filter .filter-btn');
    const browseFileBtn = document.getElementById('browse-file-btn');
    const cameraBtn = document.getElementById('camera-btn');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const fileInfoDisplay = document.getElementById('file-info-display');
    const addToClosetBtn = document.getElementById('add-to-closet-btn');
    const uploadForm = document.querySelector('#upload-view form');

    const signInView = document.getElementById('signin-view');
    const signInForm = document.getElementById('signin-form');
    const signUpForm = document.getElementById('signup-form');
    const signInTabBtn = document.getElementById('signin-tab');
    const signUpTabBtn = document.getElementById('signup-tab');
    const logoutBtn = document.querySelector('.btn.logout');
    const profileBtn = document.querySelector('.btn.profile-button');
    const navSignInBtn = document.querySelector('.btn.signin');

    const totalItemsCount = document.getElementById('totalItemsCount'); // For stat update

    let isLoggedIn = false;


    // --- CLOSET VIEW ELEMENTS & MOCK DATA ---
    const closetGridView = document.getElementById('closet-grid-view');
    const itemDetailView = document.getElementById('item-detail-view');
    const itemDetailImage = document.getElementById('item-detail-image');
    const itemDetailName = document.getElementById('item-detail-name');
    const itemDetailCategory = document.getElementById('item-detail-category'); // Added for detail view
    const itemDetailDesc = document.getElementById('item-detail-desc');
    const backToClosetBtn = document.getElementById('back-to-closet-btn');

    // MOCK DATA: Ensured category is lowercase for easy filtering
   // MOCK DATA: Ensured category is lowercase for easy filtering
const MOCK_CLOSET_DATA = [
    // --- Original 6 Items ---
    { id: 1, name: "Denim Skirt", image: "https://i.pinimg.com/1200x/d1/ac/99/d1ac9918736a611ebbb5bf468c6f53e2.jpg", category: "bottoms", description: "Light wash denim mini skirt, great for summer." },
    { id: 2, name: "Black Leather Mini Skirt", image: "https://i.pinimg.com/1200x/65/60/1e/65601e78e8e439ce9f88f467aec4c7ea.jpg", category: "bottoms", description: "Classic A-line black leather mini skirt." },
    { id: 3, name: "Pink Silk Top", image: "https://i.pinimg.com/736x/73/dc/c4/73dcc4539122b619d5f89b10289afffd.jpg", category: "tops", description: "V-neck silk top, perfect for a night out." },
    { id: 4, name: "Blue Straight Jeans", image: "https://i.pinimg.com/736x/94/7c/f0/947cf07167c4d9e42da60ee7459e4348.jpg", category: "bottoms", description: "High-waisted straight leg blue denim jeans." },
    { id: 5, name: "Brown Leather Jacket", image: "https://i.pinimg.com/1200x/34/d5/42/34d542361b5b16f52187e87f4f77b823.jpg", category: "outerwear", description: "A stylish, versatile brown leather jacket." },
    { id: 6, name: "Black Ankle Boots", image: "https://i.pinimg.com/736x/23/35/8d/23358dfdab3c4873ff74da30e96104b5.jpg", category: "shoes", description: "Sleek black ankle boots for everyday wear." },
    
    // --- 10 New Items Added ---
    { id: 7, name: "Yellow Ruffle Top", image: "https://i.pinimg.com/736x/44/04/de/4404de614c77e2c4310edb6c4a649349.jpg", category: "tops", description: "Lightweight butter yellow top with ruffle sleeves." },
    { id: 8, name: "Washed Tapered Jeans", image: "https://i.pinimg.com/1200x/3c/26/73/3c267309e9618fb4bff948a02645c3f8.jpg", category: "bottoms", description: "Comfortable washed denim with a relaxed fit." },
    { id: 9, name: "Dark Denim Jeans", image: "https://i.pinimg.com/736x/cd/f2/43/cdf2436ac91bab47009b2135a90bbf05.jpg", category: "bottoms", description: "Dark wash jeans, easy to dress up or down." },
    { id: 10, name: "Red Beach Mini Skirt", image: "https://i.pinimg.com/1200x/9a/3a/b2/9a3ab20cde70c9bc8e614cb864c82b36.jpg", category: "bottoms", description: "Flowy pink/red skirt, perfect for the beach." },
    { id: 11, name: "Brown A-line Skirt", image: "https://i.pinimg.com/736x/f6/17/78/f617787e8ae64af0b74a25b0e10904d7.jpg", category: "bottoms", description: "Structured brown skirt with a button detail." },
    { id: 12, name: "Cream Knit Maxi Skirt", image: "https://i.pinimg.com/1200x/36/d6/9d/36d69d60ae0c1a00f937fa090d0d1e10.jpg", category: "bottoms", description: "Elegant cream knit maxi skirt." },
    { id: 13, name: "Oversized Denim Jacket", image: "https://i.pinimg.com/736x/8c/d5/13/8cd513295f7eb2839e11e1db49fffe64.jpg", category: "outerwear", description: "Light blue oversized denim jacket." },
    { id: 14, name: "Casual Brown Dress", image: "https://i.pinimg.com/736x/03/5d/24/035d2412567bb712bab2c582d20039df.jpg", category: "dresses", description: "Simple mocha-colored casual midi dress." },
    { id: 15, name: "Checked Strappy Dress", image: "https://i.pinimg.com/736x/3f/d5/78/3fd578cb8ee17db81b316956bd7f8f5f.jpg", category: "dresses", description: "Yellow and white checked summer dress." },
    { id: 16, name: "Classic Sunglasses", image: "https://i.pinimg.com/736x/4b/9f/dd/4b9fdd128a60792a39addf72b5b5439b.jpg", category: "accessories", description: "Basic black frame sunglasses." }
];


    // --- VIEW SWITCH ---
    function switchView(viewId) {
        document.querySelectorAll('.app-screen').forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active');
        });

        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.style.display = 'block';
            targetView.classList.add('active');
        }

        const extrasSelectors = [
            '.about-section', '.how-it-works-box', '#testimonials',
            '.about-us', '.how-it-works', '.what-our-users-say', '.reviews-container'
        ];

        const isDashboard = viewId === 'dashboard-view';

        extrasSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = isDashboard ? 'block' : 'none';
            });
        });

        // Logic for handling the sub-views of 'closet-view'
        if (viewId === 'closet-view') {
            // Always default to the grid view when switching to the main closet
            if (closetGridView) closetGridView.style.display = 'block';
            if (itemDetailView) itemDetailView.style.display = 'none';

            // Re-render the closet to ensure the current filter is applied
            const currentFilter = document.querySelector('.category-filter .filter-btn.active')?.dataset.filter || "all";
            renderCloset(currentFilter);
        }
    }


    // --- NAVIGATION MAPPINGS ---
    const navMappings = [
        { selector: '.home-button', view: 'dashboard-view' },
        { selector: '.closet-button', view: 'closet-view' },
        { selector: '.upload-button', view: 'upload-view' },
        { selector: '.ai-button', view: 'ai-view' },
        { selector: '.upload-action', view: 'upload-view' },
        { selector: '.closet-action', view: 'closet-view' },
        { selector: '.ai-action', view: 'ai-view' },
        { selector: '.plan-event', view: 'ai-view' },
        { selector: '.add-item-card', view: 'upload-view' }
    ];

    navMappings.forEach(map => {
        document.querySelectorAll(map.selector).forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                switchView(map.view);
            });
        });
    });


    // --- FILE UPLOAD ---
    browseFileBtn?.addEventListener('click', () => fileInput?.click());

    cameraBtn?.addEventListener('click', () =>
        alert("Camera feature coming soon! 📸")
    );

    const itemTypeSelect = document.getElementById('item-type-select');
    const primaryColorSelect = document.getElementById('primary-color-select');

    const checkFormValidity = () => {
        const fileSelected = fileInput.files.length > 0;
        const itemTypeSelected = itemTypeSelect?.value !== "";
        const colorSelected = primaryColorSelect?.value !== "";

        addToClosetBtn.disabled = !(fileSelected && itemTypeSelected && colorSelected);
    };

    itemTypeSelect?.addEventListener('change', checkFormValidity);
    primaryColorSelect?.addEventListener('change', checkFormValidity);


    fileInput?.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {

            const reader = new FileReader();
            reader.onload = ev => {
                imagePreview.innerHTML = "";
                const img = document.createElement('img');
                img.src = ev.target.result;
                img.style.cssText = "max-width:100%; max-height:100%; object-fit:contain; border-radius:10px;";
                imagePreview.appendChild(img);
                imagePreview.classList.add('has-image');
            };
            reader.readAsDataURL(file);

            fileInfoDisplay.innerHTML = `<p>${file.name}</p><a href="#" id="change-photo-link">Change</a>`;
            document.getElementById('change-photo-link').addEventListener('click', e => {
                e.preventDefault();
                fileInput.click();
            });

            checkFormValidity();
        } else {
            resetUploadPreview();
        }
    });

    function resetUploadPreview() {
        imagePreview.innerHTML = `<span class="upload-icon">⬆️</span><span class="placeholder-text">Choose a photo<br>PNG, JPG up to 10MB</span>`;
        imagePreview.classList.remove('has-image');
        fileInfoDisplay.innerHTML = "";
        addToClosetBtn.disabled = true;
        fileInput.value = "";
    }


    // --- UPLOAD FORM SUBMIT ---
    addToClosetBtn?.addEventListener('click', e => {
        e.preventDefault();

        if (addToClosetBtn.disabled) return;

        alert("✅ Item added to closet!");
        uploadForm.reset();
        resetUploadPreview();

        // The next switchView will trigger a renderCloset and update the grid/stats
        switchView('closet-view');
    });


    // --- CLOSET FUNCTIONALITY (REFACTORED) ---

    /**
     * Renders item cards to the closet grid container based on the filter.
     * Combines rendering and filtering logic for efficiency.
     * @param {string} filter - The category to filter by (e.g., 'all', 'tops').
     */
    function renderCloset(filter = "all") {
        if (!closetItemsContainer) return;

        // Clear existing dynamic content
        closetItemsContainer.innerHTML = '';

        // Filter the MOCK data
        const normalizedFilter = filter.toLowerCase();
        const filteredItems = MOCK_CLOSET_DATA.filter(item => 
            normalizedFilter === "all" || item.category === normalizedFilter
        );

        // Update the stat count
        if(totalItemsCount) totalItemsCount.textContent = filteredItems.length;


        // 1. Add the static 'Add New Item' card first
        const addNewCardHtml = `
            <div class="add-item-card" data-action="upload">
                <span style="font-size: 3rem; color: #ff6b81;">+</span>
                <div>Add New Item<br><small>Upload clothes</small></div>
            </div>`;
        closetItemsContainer.insertAdjacentHTML('beforeend', addNewCardHtml);
        
        // Re-bind the navigation handler for the card (using event delegation on the container is better, but this works)
        closetItemsContainer.querySelector('.add-item-card')?.addEventListener('click', e => {
            e.preventDefault();
            switchView('upload-view');
        });


        // 2. Add the filtered item cards
        filteredItems.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('item-card');
            card.dataset.category = item.category;
            card.dataset.id = item.id;

            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <strong>${item.name}</strong><br>
                    <span>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                </div>
            `;

            // Click Handler to switch to the Detail View
            card.addEventListener('click', () => loadItemDetailView(item.id));

            closetItemsContainer.appendChild(card);
        });
    }

    /**
     * Handles switching to the Item Detail View.
     * @param {number} itemId The ID of the item to display.
     */
    function loadItemDetailView(itemId) {
        const item = MOCK_CLOSET_DATA.find(i => i.id === itemId);

        if (!item || !closetGridView || !itemDetailView) {
            alert("Item not found or view elements missing.");
            return;
        }

        // 1. Hide the grid, show the detail view
        closetGridView.style.display = 'none';
        itemDetailView.style.display = 'block';

        // 2. Populate the detail view with item data
        if (itemDetailImage) itemDetailImage.src = item.image;
        if (itemDetailImage) itemDetailImage.alt = item.name;
        if (itemDetailName) itemDetailName.textContent = item.name;
        if (itemDetailCategory) itemDetailCategory.textContent = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        if (itemDetailDesc) itemDetailDesc.textContent = item.description;

        // 3. Add event listener to go back to the grid
        // Ensure we only have one listener to avoid multiple click events
        backToClosetBtn.removeEventListener('click', goBackToClosetGrid);
        backToClosetBtn.addEventListener('click', goBackToClosetGrid);
    }
    
    function goBackToClosetGrid(e) {
        e.preventDefault();
        // Go back to the main closet view, which will default to the grid
        switchView('closet-view');
    }


    // --- CLOSET FILTERING EVENT LISTENERS ---
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter || "all";
            renderCloset(filter);
        });
    });


    // --- AUTH SYSTEM ---
    function updateAuthUI() {
        profileBtn.style.display = isLoggedIn ? "flex" : "none";
        logoutBtn.style.display = isLoggedIn ? "flex" : "none";
        navSignInBtn.style.display = isLoggedIn ? "none" : "flex";

        document.querySelectorAll('.nav-links li a').forEach(link => {
            const protect = link.classList.contains('closet-button') ||
                             link.classList.contains('upload-button') ||
                             link.classList.contains('ai-button');

            link.parentNode.style.display = isLoggedIn ? "list-item" : "none";
        });

        if (!isLoggedIn) switchView('signin-view');
        else switchView('dashboard-view');
    }

    function loginUser(e) {
        e.preventDefault();
        isLoggedIn = true;
        updateAuthUI();
        alert("Welcome back!");
    }

    function logoutUser(e) {
        e.preventDefault();
        isLoggedIn = false;
        updateAuthUI();
        alert("Logged out!");
    }

    signInForm?.addEventListener('submit', loginUser);
    signUpForm?.addEventListener('submit', loginUser);
    logoutBtn?.addEventListener('click', logoutUser);

    signInTabBtn?.addEventListener('click', () => {
        signInForm.style.display = "block";
        signUpForm.style.display = "none";
        signInTabBtn.classList.add("active");
        signUpTabBtn.classList.remove("active");
    });

    signUpTabBtn?.addEventListener('click', () => {
        signInForm.style.display = "none";
        signUpForm.style.display = "block";
        signUpTabBtn.classList.add("active");
        signInTabBtn.classList.remove("active");
    });

    navSignInBtn?.addEventListener('click', e => {
        e.preventDefault();
        switchView('signin-view');
    });


    // --- INITIAL SETUP ---
    // The initial call to renderCloset is handled within updateAuthUI when it switches to dashboard/signin
    updateAuthUI();
});
