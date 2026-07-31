/**
 * app3.js
 * Controls interactions, filters, pagination, modal registration, and rendering
 * for the Teacher Prompt Library v1 (index3.html) web application.
 */

document.addEventListener("DOMContentLoaded", () => {
    // State
    let allPrompts = [];
    let filteredPrompts = [];
    let activeCategory = "Career"; // Default active category matching index3.html
    let activeKeyword = "all";
    let currentPage = 1;
    const itemsPerPage = 10;
    let selectedPrompt = null;

    // DOM Elements - Navigation & Filters
    const catButtons = document.querySelectorAll(".cat-btn");
    const btnGoHome = document.getElementById("btn-go-home");
    const keywordFilter = document.getElementById("prompt-keyword-filter");
    const countNumber = document.getElementById("count-number");
    const promptItemsContainer = document.getElementById("prompt-items-container");

    // DOM Elements - Pagination
    const btnPrevPage = document.getElementById("btn-prev-page");
    const btnNextPage = document.getElementById("btn-next-page");
    const pageIndicator = document.getElementById("page-indicator");

    // DOM Elements - Workspace Panels
    const welcomeScreen = document.getElementById("welcome-screen");
    const activeWorkspace = document.getElementById("active-workspace");

    // DOM Elements - Active Prompt Details
    const activeCode = document.getElementById("active-code");
    const activeTitle = document.getElementById("active-title");
    const activeSubject = document.getElementById("active-subject");
    const activeTimestamp = document.getElementById("active-timestamp");
    const activeDescription = document.getElementById("active-description");
    const activeApplication = document.getElementById("active-application");
    const promptPreview = document.getElementById("prompt-preview");
    const activeImage = document.getElementById("active-image");
    const activeImageLink = document.getElementById("active-image-link");
    const imagePreviewContainer = document.getElementById("image-preview-container");

    // DOM Elements - Actions & Modals
    const btnCopyPrompt = document.getElementById("btn-copy-prompt");
    const toastMessage = document.getElementById("toast-message");
    const registerModal = document.getElementById("register-modal");
    const btnCloseModal = document.getElementById("btn-close-modal");
    const registerForm = document.getElementById("register-form");

    // DOM Elements - Theme & Font Selectors
    const btnModeLight = document.getElementById("btn-mode-light");
    const btnModeWarm = document.getElementById("btn-mode-warm");
    const btnModeDark = document.getElementById("btn-mode-dark");

    const btnFontSmall = document.getElementById("btn-font-small");
    const btnFontMedium = document.getElementById("btn-font-medium");
    const btnFontLarge = document.getElementById("btn-font-large");

    // DOM Elements - Image navigation buttons
    const btnPrevImage = document.getElementById("btn-prev-image");
    const btnNextImage = document.getElementById("btn-next-image");

    // Input fields for registration to pre-fill if exists
    const regNameInput = document.getElementById("reg-name");
    const regEmailInput = document.getElementById("reg-email");
    const regSchoolInput = document.getElementById("reg-school");
    const regAffiliationInput = document.getElementById("reg-affiliation");
    const regPurposeInput = document.getElementById("reg-purpose");

    // --- Core Initialization ---
    async function init() {
        // Initialize settings (Theme and Font Size)
        initSettings();

        // Fetch Data
        try {
            allPrompts = await window.PromptDatabase.fetchPrompts();
            
            // Populate initial registration fields if user has already filled them
            prefillRegistrationForm();

            // Set up event handlers
            setupEventHandlers();

            // Apply filters for the default active category and render
            applyFilters();

        } catch (error) {
            console.error("Initialization failed:", error);
            promptItemsContainer.innerHTML = `
                <div class="loading-spinner" style="animation:none; flex-direction:column; gap:0.5rem; text-align:center;">
                    <i data-lucide="alert-triangle" style="width:36px; height:36px; color:#ef4444;"></i>
                    <p style="color:#ef4444; font-weight:600;">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
                    <p style="font-size:0.75rem;">โปรดตรวจสอบว่าเปิดหน้าเว็บนี้ผ่าน Web Server (เช่น http://localhost) หรือไม่</p>
                </div>
            `;
            lucide.createIcons();
        }
    }

    // --- Screen Mode & Font Size Control ---
    function setScreenMode(mode) {
        // Remove all theme classes
        document.body.classList.remove("light-theme", "warm-theme", "dark-theme");
        document.body.classList.add(`${mode}-theme`);
        localStorage.setItem("promptLibTheme", mode);

        // Update active class on buttons
        const modeButtons = [btnModeLight, btnModeWarm, btnModeDark];
        modeButtons.forEach(btn => {
            if (btn) btn.classList.remove("active");
        });

        const activeBtn = document.getElementById(`btn-mode-${mode}`);
        if (activeBtn) activeBtn.classList.add("active");
        
        lucide.createIcons();
    }

    function setFontSize(size) {
        // Remove all font classes from html
        document.documentElement.classList.remove("font-sz-small", "font-sz-medium", "font-sz-large");
        document.documentElement.classList.add(`font-sz-${size}`);
        localStorage.setItem("promptLibFontSize", size);

        // Update active class on buttons
        const fontButtons = [btnFontSmall, btnFontMedium, btnFontLarge];
        fontButtons.forEach(btn => {
            if (btn) btn.classList.remove("active");
        });

        const activeBtn = document.getElementById(`btn-font-${size}`);
        if (activeBtn) activeBtn.classList.add("active");
    }

    function initSettings() {
        const savedTheme = localStorage.getItem("promptLibTheme") || "light";
        setScreenMode(savedTheme);

        const savedFontSize = localStorage.getItem("promptLibFontSize") || "medium";
        setFontSize(savedFontSize);
    }

    // --- Filter Logic ---
    function applyFilters() {
        filteredPrompts = allPrompts.filter(item => {
            // 1. Category Filter
            const categoryMatch = item.category.toLowerCase() === activeCategory.toLowerCase();
            if (!categoryMatch) return false;

            // 2. Keyword Filter
            if (activeKeyword === "all") return true;

            const text = (item.promptText + " " + item.title + " " + item.categoryThai).toLowerCase();
            switch (activeKeyword) {
                case "dashboard":
                    return text.includes("dashboard") || text.includes("แผงควบคุม") || text.includes("ui");
                case "starterpack":
                    return text.includes("starter pack") || text.includes("ของเล่นจำลอง") || text.includes("ของเล่น") || text.includes("toy");
                case "packaging":
                    return text.includes("packaging") || text.includes("บรรจุภัณฑ์") || text.includes("กล่อง");
                case "pose":
                    return text.includes("pose") || text.includes("ท่าทาง") || text.includes("สรีระ") || text.includes("ท่า");
                case "crayon":
                    return text.includes("crayon") || text.includes("สีเทียน");
                case "lanna":
                    return text.includes("lanna") || text.includes("ล้านนา") || text.includes("บ่อสร้าง") || text.includes("เชียงใหม่");
                default:
                    return true;
            }
        });

        // Reset pagination
        currentPage = 1;
        countNumber.textContent = filteredPrompts.length;

        // Render List
        renderList();
    }

    // --- Rendering ---
    function renderList() {
        promptItemsContainer.innerHTML = "";

        if (filteredPrompts.length === 0) {
            promptItemsContainer.innerHTML = `
                <div style="text-align:center; padding:2rem; color:var(--text-secondary); font-size:0.85rem;">
                    ไม่พบรายการที่ตรงกับตัวกรอง
                </div>
            `;
            updatePaginationControls();
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredPrompts.length);
        const pageItems = filteredPrompts.slice(startIndex, endIndex);

        pageItems.forEach(item => {
            const card = document.createElement("div");
            card.className = `prompt-item-card ${selectedPrompt && selectedPrompt.id === item.id ? "active" : ""}`;
            card.innerHTML = `
                <div class="item-card-header">
                    <span class="item-code">${item.id}</span>
                    <span class="item-date">${item.timestamp ? item.timestamp.split(" ")[0] : ""}</span>
                </div>
                <div class="item-card-title">${item.title}</div>
                <div class="item-card-desc">${item.description}</div>
            `;

            card.addEventListener("click", () => {
                const activeCard = promptItemsContainer.querySelector(".prompt-item-card.active");
                if (activeCard) activeCard.classList.remove("active");

                card.classList.add("active");
                selectPrompt(item);
            });

            promptItemsContainer.appendChild(card);
        });

        updatePaginationControls();
    }

    function selectPrompt(prompt) {
        selectedPrompt = prompt;

        // Display panel
        welcomeScreen.classList.add("hidden");
        activeWorkspace.classList.remove("hidden");

        // Set content
        activeCode.textContent = prompt.id;
        activeTitle.textContent = prompt.title;
        activeSubject.textContent = prompt.subject;
        activeTimestamp.textContent = `บันทึกเมื่อ: ${prompt.timestamp || "ไม่มีข้อมูล"}`;
        activeDescription.textContent = prompt.description;
        activeApplication.innerHTML = prompt.application;
        promptPreview.textContent = prompt.promptText;

        // Image Handling
        if (prompt.imageUrl) {
            imagePreviewContainer.classList.remove("hidden");
            activeImage.src = prompt.imageUrl;
            activeImageLink.href = prompt.imageUrl;
        } else {
            imagePreviewContainer.classList.add("hidden");
        }

        // Scroll workspace to top
        document.getElementById("workspace-container").scrollTop = 0;
        
        // Update Image navigation buttons state
        updateImageNavigator();

        // Re-trigger Lucide Icons
        lucide.createIcons();
    }

    function resetWorkspace() {
        selectedPrompt = null;
        const activeCard = promptItemsContainer.querySelector(".prompt-item-card.active");
        if (activeCard) activeCard.classList.remove("active");

        activeWorkspace.classList.add("hidden");
        welcomeScreen.classList.remove("hidden");
        
        // Also update image navigation
        updateImageNavigator();
    }

    function updateImageNavigator() {
        if (!selectedPrompt || filteredPrompts.length === 0) {
            if (btnPrevImage) btnPrevImage.disabled = true;
            if (btnNextImage) btnNextImage.disabled = true;
            return;
        }

        const currentIndex = filteredPrompts.findIndex(p => p.id === selectedPrompt.id);
        
        if (btnPrevImage) btnPrevImage.disabled = currentIndex <= 0;
        if (btnNextImage) btnNextImage.disabled = currentIndex === -1 || currentIndex >= filteredPrompts.length - 1;
    }

    function updateActiveCardInList(promptId) {
        const cards = promptItemsContainer.querySelectorAll(".prompt-item-card");
        let targetCard = null;
        
        cards.forEach(card => {
            const cardCode = card.querySelector(".item-code").textContent;
            if (cardCode === promptId) {
                card.classList.add("active");
                targetCard = card;
            } else {
                card.classList.remove("active");
            }
        });

        if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function updatePaginationControls() {
        const totalPages = Math.max(1, Math.ceil(filteredPrompts.length / itemsPerPage));
        
        btnPrevPage.disabled = currentPage === 1;
        btnNextPage.disabled = currentPage === totalPages;
        
        pageIndicator.textContent = `หน้า ${currentPage} / ${totalPages}`;
    }

    // --- Copy & Registration Logic ---
    function copyPromptText() {
        if (!selectedPrompt) return;

        const isRegistered = localStorage.getItem("isPromptLibRegistered") === "true";

        if (!isRegistered) {
            registerModal.classList.remove("hidden");
        } else {
            executeCopy(selectedPrompt.promptText);
        }
    }

    function executeCopy(text) {
        navigator.clipboard.writeText(text).then(() => {
            toastMessage.classList.remove("hidden");
            setTimeout(() => {
                toastMessage.classList.add("hidden");
            }, 3000);
        }).catch(err => {
            console.error("Could not copy prompt text: ", err);
            alert("ไม่สามารถคัดลอกข้อความได้ โปรดคัดลอกด้วยตนเองจากช่องพรีวิวสด");
        });
    }

    // Load registered profile from localStorage
    function prefillRegistrationForm() {
        if (localStorage.getItem("isPromptLibRegistered") === "true") {
            regNameInput.value = localStorage.getItem("reg_name") || "";
            regEmailInput.value = localStorage.getItem("reg_email") || "";
            regSchoolInput.value = localStorage.getItem("reg_school") || "";
            regAffiliationInput.value = localStorage.getItem("reg_affiliation") || "";
            regPurposeInput.value = localStorage.getItem("reg_purpose") || "";
        }
    }

    function handleRegistrationSubmit(e) {
        e.preventDefault();

        // Save fields
        localStorage.setItem("isPromptLibRegistered", "true");
        localStorage.setItem("reg_name", regNameInput.value);
        localStorage.setItem("reg_email", regEmailInput.value);
        localStorage.setItem("reg_school", regSchoolInput.value);
        localStorage.setItem("reg_affiliation", regAffiliationInput.value);
        localStorage.setItem("reg_purpose", regPurposeInput.value);

        registerModal.classList.add("hidden");

        if (selectedPrompt) {
            executeCopy(selectedPrompt.promptText);
        }
    }

    // --- Event Handlers Setup ---
    function setupEventHandlers() {
        // Sidebar category buttons
        catButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                catButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                activeCategory = btn.getAttribute("data-category");
                resetWorkspace();
                applyFilters();
            });
        });

        // Go home button
        btnGoHome.addEventListener("click", () => {
            catButtons.forEach(b => {
                if (b.getAttribute("data-category") === "Career") {
                    b.classList.add("active");
                } else {
                    b.classList.remove("active");
                }
            });
            activeCategory = "Career";
            resetWorkspace();
            applyFilters();
        });

        // Keyword filter
        keywordFilter.addEventListener("change", (e) => {
            activeKeyword = e.target.value;
            applyFilters();
        });

        // Pagination buttons
        btnPrevPage.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderList();
            }
        });

        btnNextPage.addEventListener("click", () => {
            const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderList();
            }
        });

        // Screen Mode Selectors
        if (btnModeLight) btnModeLight.addEventListener("click", () => setScreenMode("light"));
        if (btnModeWarm) btnModeWarm.addEventListener("click", () => setScreenMode("warm"));
        if (btnModeDark) btnModeDark.addEventListener("click", () => setScreenMode("dark"));

        // Font Size Selectors
        if (btnFontSmall) btnFontSmall.addEventListener("click", () => setFontSize("small"));
        if (btnFontMedium) btnFontMedium.addEventListener("click", () => setFontSize("medium"));
        if (btnFontLarge) btnFontLarge.addEventListener("click", () => setFontSize("large"));

        // Image & Prompt Navigation Buttons
        if (btnPrevImage) {
            btnPrevImage.addEventListener("click", () => {
                if (!selectedPrompt) return;
                const currentIndex = filteredPrompts.findIndex(p => p.id === selectedPrompt.id);
                if (currentIndex > 0) {
                    const prevPrompt = filteredPrompts[currentIndex - 1];
                    selectPrompt(prevPrompt);
                    updateActiveCardInList(prevPrompt.id);
                }
            });
        }

        if (btnNextImage) {
            btnNextImage.addEventListener("click", () => {
                if (!selectedPrompt) return;
                const currentIndex = filteredPrompts.findIndex(p => p.id === selectedPrompt.id);
                if (currentIndex !== -1 && currentIndex < filteredPrompts.length - 1) {
                    const nextPrompt = filteredPrompts[currentIndex + 1];
                    selectPrompt(nextPrompt);
                    updateActiveCardInList(nextPrompt.id);
                }
            });
        }

        // Copy
        btnCopyPrompt.addEventListener("click", copyPromptText);

        // Close Modal
        btnCloseModal.addEventListener("click", () => {
            registerModal.classList.add("hidden");
        });

        // Form Submit
        registerForm.addEventListener("submit", handleRegistrationSubmit);

        // Close modal when clicking outside
        registerModal.addEventListener("click", (e) => {
            if (e.target === registerModal) {
                registerModal.classList.add("hidden");
            }
        });
    }

    init();
});
