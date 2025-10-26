document.addEventListener('DOMContentLoaded', () => {
    // --- Closet Mock Data ---
    const MOCK_CLOSET_ITEMS = [
        { id: 1, name: 'Blue Shirt', category: 'Tops', color: 'Blue', img: 'path/to/shirt1.jpg' },
        { id: 2, name: 'Red Dress', category: 'Dresses', color: 'Red', img: 'path/to/dress1.jpg' },
        { id: 3, name: 'Black Jeans', category: 'Bottoms', color: 'Black', img: 'path/to/jeans1.jpg' },
        { id: 4, name: 'White Tee', category: 'Tops', color: 'White', img: 'path/to/tee1.jpg' },
        { id: 5, name: 'Leather Belt', category: 'Accessories', color: 'Brown', img: 'path/to/belt1.jpg' },
        { id: 6, name: 'Rain Coat', category: 'Outerwear', color: 'Yellow', img: 'path/to/coat1.jpg' },
        { id: 7, name: 'Sneakers', category: 'Shoes', color: 'White', img: 'path/to/shoes1.jpg' },
    ];

    // --- DOM ELEMENTS ---
    const closetItemsContainer = document.querySelector('.closet-items');
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
    const navSignInBtn = document.getElementById('nav-signin-btn');

    let isLoggedIn = false;

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

        // Extras like About, How it Works, Testimonials
        const extrasSelectors = [
            '.about-section', '.how-it-works-box', '#testimonials',
            '.about-us', '.how-it-works', '.what-our-users-say'
        ];
        const isDashboard = viewId === 'dashboard-view';
        extrasSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = isDashboard ? 'block' : 'none';
            });
        });
    }

    // --- NAV BUTTONS ---
    const navMappings = [
        { selector: '.home-button', view: 'dashboard-view' },
        { selector: '.closet-button', view: 'closet-view' },
        { selector: '.upload-button', view: 'upload-view' },
        { selector: '.ai-button', view: 'ai-view' },
        { selector: '.upload-action', view: 'upload-view' },
        { selector: '.closet-action', view: 'closet-view' },
        { selector: '.ai-action', view: 'ai-view' },
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
    cameraBtn?.addEventListener('click', () => alert("Camera feature not implemented."));

    fileInput?.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = ev => {
                if (imagePreview) {
                    imagePreview.innerHTML = `<img src="${ev.target.result}" style="max-width:100%; max-height:100%; object-fit:contain;">`;
                    imagePreview.classList.add('has-image');
                }
                if (fileInfoDisplay) fileInfoDisplay.innerHTML = `<p>${file.name}</p><a href="#" id="change-photo-link">Change photo</a>`;
                document.getElementById('change-photo-link')?.addEventListener('click', e => { e.preventDefault(); fileInput.click(); });
                if (addToClosetBtn) addToClosetBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        } else {
            if (imagePreview) {
                imagePreview.innerHTML = `<span class="upload-icon">⬆️</span><span class="placeholder-text">Choose a photo<br>PNG, JPG up to 10MB</span>`;
                imagePreview.classList.remove('has-image');
            }
            if (fileInfoDisplay) fileInfoDisplay.innerHTML = '';
            if (addToClosetBtn) addToClosetBtn.disabled = true;
        }
    });

    // --- UPLOAD FORM SUBMIT ---
    uploadForm?.addEventListener('submit', e => {
        e.preventDefault();
        if (addToClosetBtn?.disabled) return;
        const itemType = uploadForm.querySelector('select:nth-of-type(1)')?.value || '';
        alert(`✅ Success! Item "${itemType}" added.`);
        uploadForm.reset();
        if (imagePreview) imagePreview.innerHTML = `<span class="upload-icon">⬆️</span><span class="placeholder-text">Choose a photo<br>PNG, JPG up to 10MB</span>`;
        imagePreview?.classList.remove('has-image');
        if (fileInfoDisplay) fileInfoDisplay.innerHTML = '';
        if (addToClosetBtn) addToClosetBtn.disabled = true;
        switchView('closet-view');
    });

    // --- RENDER CLOSET ---
    function renderCloset(filterCategory = 'All') {
        if (!closetItemsContainer) return;

        let html = `<div class="add-item-card"><span style="font-size:2rem;">➕</span><p>Add New Item</p></div>`;
        const filtered = filterCategory === 'All' ? MOCK_CLOSET_ITEMS : MOCK_CLOSET_ITEMS.filter(i => i.category === filterCategory);
        filtered.forEach(item => {
            html += `<div class="item-card">
                        <img src="https://via.placeholder.com/100/${item.color.toLowerCase()}/FFFFFF/?text=${item.id}" alt="${item.name}">
                        <p>${item.name}</p><span>${item.category}</span>
                     </div>`;
        });
        closetItemsContainer.innerHTML = html;

        document.querySelector('.add-item-card')?.addEventListener('click', e => { e.preventDefault(); switchView('upload-view'); });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.filter || 'All';
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderCloset(category === 'all' ? 'All' : category);
        });
    });

    // --- AUTH FUNCTIONS ---
    function updateAuthUI() {
        if (profileBtn) profileBtn.style.display = isLoggedIn ? 'flex' : 'none';
        if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'flex' : 'none';
        if (navSignInBtn) navSignInBtn.style.display = isLoggedIn ? 'none' : 'flex';

        document.querySelectorAll('.nav-links li a').forEach(link => {
            const isProtected = link.classList.contains('closet-button') || link.classList.contains('upload-button') || link.classList.contains('ai-button');
            if (isProtected) link.parentNode.style.display = isLoggedIn ? 'list-item' : 'none';
        });

        if (!isLoggedIn) switchView('signin-view');
        else {
            const current = document.querySelector('.app-screen.active')?.id;
            if (!current || current === 'signin-view') switchView('dashboard-view');
        }
    }

    function loginUser(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]')?.value;
        const password = e.target.querySelector('input[type="password"]')?.value;
        if (email && password) { isLoggedIn = true; updateAuthUI(); alert('Welcome back!'); }
        else alert('Enter email & password.');
    }

    function logoutUser(e) { e.preventDefault(); isLoggedIn = false; updateAuthUI(); alert('Logged out.'); }

    signInForm?.addEventListener('submit', loginUser);
    signUpForm?.addEventListener('submit', e => { e.preventDefault(); loginUser(e); });
    logoutBtn?.addEventListener('click', logoutUser);
    signInTabBtn?.addEventListener('click', () => { signInForm.style.display='block'; signUpForm.style.display='none'; signInTabBtn.classList.add('active'); signUpTabBtn.classList.remove('active'); });
    signUpTabBtn?.addEventListener('click', () => { signInForm.style.display='none'; signUpForm.style.display='block'; signInTabBtn.classList.remove('active'); signUpTabBtn.classList.add('active'); });
    navSignInBtn?.addEventListener('click', e => { e.preventDefault(); switchView('signin-view'); });

    updateAuthUI();
    renderCloset(); // Initial render
});
