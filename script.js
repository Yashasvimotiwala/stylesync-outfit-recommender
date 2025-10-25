document.addEventListener('DOMContentLoaded', () => {
    // --- Closet Mock Data (Dynamic demo items) ---
    const MOCK_CLOSET_ITEMS = [
        // Match these categories to your HTML filter buttons and item data-category
        { id: 1, name: 'Blue Shirt', category: 'Tops', color: 'Blue', img: 'path/to/shirt1.jpg' },
        { id: 2, name: 'Red Dress', category: 'Dresses', color: 'Red', img: 'path/to/dress1.jpg' },
        { id: 3, name: 'Black Jeans', category: 'Bottoms', color: 'Black', img: 'path/to/jeans1.jpg' },
        { id: 4, name: 'White Tee', category: 'Tops', color: 'White', img: 'path/to/tee1.jpg' },
        { id: 5, name: 'Leather Belt', category: 'Accessories', color: 'Brown', img: 'path/to/belt1.jpg' },
        { id: 6, name: 'Rain Coat', category: 'Outerwear', color: 'Yellow', img: 'path/to/coat1.jpg' },
        { id: 7, name: 'Sneakers', category: 'Shoes', color: 'White', img: 'path/to/shoes1.jpg' },
    ];

    // ===========================================
    // --- 0. VARIABLE DECLARATIONS (CONSOLIDATED) ---
    // ===========================================
    const browseFileBtn = document.getElementById('browse-file-btn');
    const cameraBtn = document.getElementById('camera-btn');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const placeholderText = imagePreview ? imagePreview.querySelector('.placeholder-text') : null;
    const addToClosetBtn = document.getElementById('add-to-closet-btn');
    const uploadForm = document.querySelector('#upload-view form');
    const fileInfoDisplay = document.getElementById('file-info-display');
    
    // Closet DOM Elements
    const closetItemsContainer = document.querySelector('.closet-items');
    const filterButtons = document.querySelectorAll('.category-filter .filter-btn'); 

    // Auth DOM Elements
    const signInView = document.getElementById('signin-view');
    const signInForm = document.getElementById('signin-form');
    const signUpForm = document.getElementById('signup-form');
    const signInTabBtn = document.getElementById('signin-tab');
    const signUpTabBtn = document.getElementById('signup-tab');
    // Using IDs for reliability:
    const logoutBtn = document.querySelector('.btn.logout'); // Assuming this is unique
    const profileBtn = document.querySelector('.btn.profile-button'); // Assuming this is unique
    const navSignInBtn = document.getElementById('nav-signin-btn'); // 👈 ADD THIS ID TO YOUR NAVBAR HTML!

    // --- GLOBAL STATE --- 
    let isLoggedIn = false; // Mock Authentication State


    // =========================================
    // --- 1. VIEW SWITCHING LOGIC (UPDATED) ---
    // =========================================
   // =========================================
// --- 1. VIEW SWITCHING LOGIC (UPDATED to fix Sign In view issue) ---
// =========================================

function switchView(viewId) {
    // 1. Hide all screens
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.style.display = 'none';
        screen.classList.remove('active');
    });

    // 2. Show target screen
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.style.display = 'block';
        targetView.classList.add('active');
    }

    // 3. CONTROL VISIBILITY OF 'ABOUT US' AND OTHER EXTRAS:
    // We check if the target view is the 'dashboard-view' (which is your Home page)
    const isDashboard = viewId === 'dashboard-view';
    const extras = document.querySelectorAll('.about-section, .how-it-works-box, #testimonials');

    extras.forEach(el => {
        if (el) {
            // Show only if it's the dashboard, hide otherwise
            el.style.display = isDashboard ? 'block' : 'none'; 
        }
    });

    // 4. Update navigation active states (Assuming you have an updateNavActiveState function)
    // updateNavActiveState(viewId); 
    // NOTE: I commented this out because 'updateNavActiveState' wasn't provided, 
    // but your original code had it. Keep it if it's defined elsewhere.
}

    // --- 2. NAVBAR & DASHBOARD BUTTON HANDLERS ---
    const navButtonMappings = [
        { selector: '.home-button', view: 'dashboard-view' },
        { selector: '.closet-button', view: 'closet-view' },
        { selector: '.upload-button', view: 'upload-view' },
        { selector: '.ai-button', view: 'ai-view' },
        { selector: '.upload-action', view: 'upload-view' }, // Dashboard Action
        { selector: '.closet-action', view: 'closet-view' }, // Dashboard Action
        { selector: '.ai-action', view: 'ai-view' },         // Dashboard Action
        { selector: '.add-item-card', view: 'upload-view' }, // Closet Add Card
    ];

    navButtonMappings.forEach(mapping => {
        document.querySelectorAll(mapping.selector).forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                switchView(mapping.view);
            });
        });
    });


    // ===========================================
    // --- 3. FILE UPLOAD & PREVIEW LOGIC ---
    // ===========================================
    if (browseFileBtn && fileInput) {
        browseFileBtn.addEventListener('click', () => { fileInput.click(); });
    }

    if (fileInput && imagePreview) {
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    imagePreview.innerHTML = `
                        <img src="${e.target.result}" alt="Uploaded Item" style="max-width:100%; max-height:100%; object-fit:contain;">
                    `;
                    imagePreview.style.backgroundImage = 'none'; 
                    imagePreview.classList.add('has-image');
                    
                    if (fileInfoDisplay) {
                        fileInfoDisplay.innerHTML = `
                            <p style="text-align:center; margin: 0.5rem 0 0.2rem 0; font-weight: 500;">${file.name}</p>
                            <a href="#" id="change-photo-link" style="text-align:center; display:block; color:#ff6b81; cursor:pointer; font-size:0.9em;">Change photo</a>
                        `;
                        document.getElementById('change-photo-link').addEventListener('click', (linkEvent) => {
                            linkEvent.preventDefault();
                            fileInput.click();
                        });
                    }

                    if (addToClosetBtn) addToClosetBtn.disabled = false;
                };
                fileReader.readAsDataURL(file);
            } else {
                // Reset to placeholder state
                imagePreview.innerHTML = `
                    <span class="upload-icon">⬆️</span> 
                    <span class="placeholder-text">Choose a photo<br>PNG, JPG up to 10MB</span>
                `;
                imagePreview.classList.remove('has-image');
                if (fileInfoDisplay) fileInfoDisplay.innerHTML = '';
                if (addToClosetBtn) addToClosetBtn.disabled = true;
            }
        });
    }

    if (cameraBtn) {
        cameraBtn.addEventListener('click', () => {
            alert("Camera feature is not yet fully implemented.");
        });
    }

    // --- 4. Mock "Add to Closet" Submission Logic ---
    if (uploadForm && addToClosetBtn) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            if (addToClosetBtn.disabled) return;
            
            const itemType = uploadForm.querySelector('select:nth-of-type(1)').value;
            
            alert(`✅ Success! Item "${itemType}" is ready to be added.`);
            
            // Reset the form and UI state
            uploadForm.reset();
            imagePreview.innerHTML = `
                <span class="upload-icon">⬆️</span> 
                <span class="placeholder-text">Choose a photo<br>PNG, JPG up to 10MB</span>
            `;
            imagePreview.classList.remove('has-image');
            if (fileInfoDisplay) fileInfoDisplay.innerHTML = '';
            addToClosetBtn.disabled = true;
            switchView('closet-view'); // Switch to closet view after "adding"
        });
    }

    // ===========================================
    // --- 5. CLOSET FILTERING AND RENDERING ---
    // ===========================================

    // Function to draw the item cards based on the active filter
    function renderCloset(filterCategory) {
        if (!closetItemsContainer) return;
        
        // Start by showing the 'Add New Item' card
        let html = `
            <div class="add-item-card">
                <span style="font-size: 2rem;">➕</span>
                <p style="margin: 0; font-weight: 600;">Add New Item</p>
            </div>
        `;

        // Filter items
        const categoryKey = filterCategory === 'All' ? 'All' : filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1).toLowerCase().replace('s', '');
        const filteredItems = filterCategory === 'All' 
            ? MOCK_CLOSET_ITEMS 
            : MOCK_CLOSET_ITEMS.filter(item => item.category === categoryKey);

        // Create HTML for each item (using placeholder image)
        filteredItems.forEach(item => {
            html += `
                <div class="item-card">
                    <img src="https://via.placeholder.com/100/${item.color.toLowerCase()}/FFFFFF/?text=${item.category.slice(0, 1) + item.id}" alt="${item.name}">
                    <p style="margin: 0.5rem 0 0.2rem 0; font-weight: 500;">${item.name}</p>
                    <span style="font-size: 0.8rem; color: #888;">${item.category}</span>
                </div>
            `;
        });

        // Update the container
        closetItemsContainer.innerHTML = html;

        // Re-attach the listener to the newly rendered 'Add New Item' card
        document.querySelector('.add-item-card')?.addEventListener('click', e => {
            e.preventDefault();
            switchView('upload-view');
        });
    }

    // Attach click handlers to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const categoryToFilter = category === 'all'
                ? 'All'
                : category.charAt(0).toUpperCase() + category.slice(1);
            renderCloset(categoryToFilter);
        });
    });

    // --- AUTH MODAL: open/close, tabs, demo submit ---
    (function () {
        const authOverlay = document.getElementById('signin-view');
        const signInNavBtn = document.querySelector('.btn.signin');
        const authCloseBtn = document.querySelector('.auth-close');
        const signinTab = document.getElementById('signin-tab');
        const signupTab = document.getElementById('signup-tab');
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');

        function openAuthModal() {
            if (!authOverlay) return;
            authOverlay.classList.add('modal-open');
            authOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
            signinTab?.classList.add('active');
            signupTab?.classList.remove('active');
            if (signinForm) signinForm.style.display = 'block';
            if (signupForm) signupForm.style.display = 'none';
            setTimeout(() => document.getElementById('login-email')?.focus(), 100);
        }

        function closeAuthModal() {
            if (!authOverlay) return;
            authOverlay.classList.remove('modal-open');
            authOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }

        signInNavBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal();
        });

        authCloseBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            closeAuthModal();
        });

        // close when clicking outside the card
        authOverlay?.addEventListener('click', (e) => {
            if (e.target === authOverlay) closeAuthModal();
        });

        // close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeAuthModal();
        });

        // tab toggles
        signinTab?.addEventListener('click', () => {
            signinTab.classList.add('active');
            signupTab.classList.remove('active');
            if (signinForm) signinForm.style.display = 'block';
            if (signupForm) signupForm.style.display = 'none';
        });
        signupTab?.addEventListener('click', () => {
            signupTab.classList.add('active');
            signinTab.classList.remove('active');
            if (signupForm) signupForm.style.display = 'block';
            if (signinForm) signinForm.style.display = 'none';
        });

        // demo submit handlers (replace with real auth later)
        signinForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = (document.getElementById('login-email')?.value || 'user');
            const username = email.split('@')[0];
            document.querySelector('.user-name') && (document.querySelector('.user-name').textContent = username);
            // hide any logged-out UI if present (optional)
            document.querySelectorAll('.logged-out-only').forEach(el => el.style.display = 'none');
            closeAuthModal();
            switchView('dashboard-view');
        });

        signupForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            closeAuthModal();
            switchView('dashboard-view');
        });
    })();


    // ===============================================
    // --- 7. USER AUTHENTICATION & STATE MANAGEMENT ---
    // ===============================================

    /**
     * Updates the Navbar elements (Sign In, Profile, Logout) based on login state.
     */
    function updateAuthUI() {
        // Use the globally declared variables/queries
        
        // Toggle Nav Actions (Sign In vs. Profile/Logout)
        if (profileBtn) profileBtn.style.display = isLoggedIn ? 'flex' : 'none';
        if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'flex' : 'none';
        
        // 👈 FIXED: Use the specific ID for the Navbar Sign In button
        if (navSignInBtn) navSignInBtn.style.display = isLoggedIn ? 'none' : 'flex'; 

        // Toggle protected links visibility (My Closet, Upload, AI)
        document.querySelectorAll('.nav-links li a').forEach(link => {
            const isProtected = link.classList.contains('closet-button') || link.classList.contains('upload-button') || link.classList.contains('ai-button');
            if (isProtected) {
                link.parentNode.style.display = isLoggedIn ? 'list-item' : 'none';
            }
        });

        // If logged out, force showing the sign-in screen
        if (!isLoggedIn) {
            switchView('signin-view');
            switchAuthTab('login'); // Ensure it starts on the Sign In tab
        } else {
            // If logged in, check the current view and switch to dashboard if needed
            const currentView = document.querySelector('.app-screen.active')?.id;
            if (currentView === 'signin-view' || !currentView) {
                switchView('dashboard-view');
            }
        }
    }

    /**
     * Mock function to simulate a successful login.
     */
    function loginUser(e) {
        e.preventDefault();
        
        // This targets the specific input fields inside the form that submitted the event (e.target)
        const emailInput = e.target.querySelector('input[type="email"]');
        const passwordInput = e.target.querySelector('input[type="password"]');

        if (emailInput && passwordInput && emailInput.value && passwordInput.value) {
            isLoggedIn = true;
            updateAuthUI();
            alert(`Welcome back, StyleSync User!`);
        } else {
            alert('Please enter both email and password.');
        }
    }

    /**
     * Mock function to simulate logging out.
     */
    function logoutUser(e) {
        e.preventDefault();
        isLoggedIn = false;
        updateAuthUI();
        alert('You have been logged out.');
    }

    // --- Tab Switching in Auth Card ---
    function switchAuthTab(tabId) {
        if (!signInForm || !signUpForm) return;

        if (tabId === 'login') {
            signInForm.style.display = 'block';
            signUpForm.style.display = 'none';
            signInTabBtn?.classList.add('active');
            signUpTabBtn?.classList.remove('active');
        } else {
            signInForm.style.display = 'none';
            signUpForm.style.display = 'block';
            signInTabBtn?.classList.remove('active');
            signUpTabBtn?.classList.add('active');
        }
    }

    // --- Attach Auth Listeners ---
    // 1. Sign In Form Submission (Handles the Sign In button inside the form)
    if (signInForm) { signInForm.addEventListener('submit', loginUser); }
    
    // 2. Logout Button Click
    if (logoutBtn) { logoutBtn.addEventListener('click', logoutUser); }
    
    // 3. Sign Up Form Submission
    if (signUpForm) {
        signUpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Sign Up logic is a placeholder. Auto-logging you in now.");
            loginUser(e);
        });
    }
    
    // 4. Tab Handlers
    signInTabBtn?.addEventListener('click', () => switchAuthTab('login'));
    signUpTabBtn?.addEventListener('click', () => switchAuthTab('signup'));

    // 5. CRUCIAL FIX: Navbar Sign In button handler
    // 👈 FIXED: Use the specific ID for the Navbar Sign In button click
    navSignInBtn?.addEventListener('click', e => {
        e.preventDefault();
        switchView('signin-view');
    });


    // --- INITIALIZATION ---
    // This runs when the page loads to check the state and show the correct UI
    updateAuthUI(); 

    // Ensure extras (About, How It Works, Testimonials) are visible only on dashboard
    function updateExtrasVisibility() {
        const extras = document.querySelectorAll('.about-section, .how-it-works-box, #testimonials');
        // find active screen: prefer .app-screen.active, otherwise visible one
        let activeScreen = document.querySelector('.app-screen.active');
        if (!activeScreen) {
            activeScreen = Array.from(document.querySelectorAll('.app-screen'))
                .find(s => getComputedStyle(s).display !== 'none');
        }
        const isDashboard = activeScreen && activeScreen.id === 'dashboard-view';
        extras.forEach(el => {
            if (!el) return;
            el.style.display = isDashboard ? 'block' : 'none';
        });
    }

    // Run on load
    updateExtrasVisibility();

    // Update when user navigates — hook common navigation events
    // 1) clicks
    document.addEventListener('click', (e) => {
        // small debounce to allow view switch to apply
        setTimeout(updateExtrasVisibility, 80);
    }, { capture: true });

    // 2) observe class/style changes on app-screen container(s)
    const observer = new MutationObserver(() => updateExtrasVisibility());
    document.querySelectorAll('.app-screen').forEach(s => observer.observe(s, { attributes: true, attributeFilter: ['class', 'style'] }));

    // 3) fallback interval (safe)
    const iv = setInterval(updateExtrasVisibility, 600);
    // stop interval after app has been idle a bit
    setTimeout(() => clearInterval(iv), 10000);
});  
// ---- Show / Hide Home Sections ---- //

function showHomePage() {
    document.querySelector(".about-us").style.display = "block";
    document.querySelector(".how-it-works").style.display = "block";
    document.querySelector(".what-our-users-say").style.display = "block";
}

function hideHomeSections() {
    document.querySelector(".about-us").style.display = "none";
    document.querySelector(".how-it-works").style.display = "none";
    document.querySelector(".what-our-users-say").style.display = "none";
}

document.querySelector(".home-button").addEventListener("click", showHomePage);

document.querySelector(".upload-button").addEventListener("click", hideHomeSections);
document.querySelector(".closet-button").addEventListener("click", hideHomeSections);
document.querySelector(".ai-button").addEventListener("click", hideHomeSections);
