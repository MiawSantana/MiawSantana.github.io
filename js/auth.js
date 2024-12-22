const FOUNDER_EMAIL = "suzuya23655@gmail.com";
const FOUNDER_PASSWORD = "ZenoFounder2024";

function updateUIForLoggedUser(user) {
    const navButtons = document.querySelector('nav ul');
    
    // Si l'utilisateur n'est pas connecté, restaurer les boutons de connexion/inscription
    if (!user) {
        navButtons.innerHTML = `
            <li><a href="#features">Fonctionnalités</a></li>
            <li><a href="#pricing">Abonnements</a></li>
            <li><a href="https://discord.gg/Wk28VF68s7">Contact</a></li>
            <li><button class="nav-btn login-btn">Connexion</button></li>
            <li><button class="nav-btn signup-btn">Inscription</button></li>
        `;
        return;
    }

    // Supprimer les anciens boutons de connexion/inscription
    const authButtons = navButtons.querySelectorAll('.nav-btn');
    authButtons.forEach(btn => btn.parentElement.remove());

    // Créer la section utilisateur
    const userSection = document.createElement('li');
    userSection.className = 'user-section';
    
    // Récupérer la photo de profil sauvegardée
    const savedProfilePic = localStorage.getItem('profilePic') || 'images/default-avatar.png';

    userSection.innerHTML = `
        <div class="user-profile">
            <div class="profile-pic">
                <img src="${savedProfilePic}" alt="Photo de profil">
            </div>
            <span class="user-name">${user.name}</span>
        </div>
        <div class="profile-dropdown">
            <div class="dropdown-content">
                <div class="dropdown-header">
                    <div class="profile-pic-large">
                        <img src="${savedProfilePic}" alt="Photo de profil">
                        <label for="profile-upload" class="upload-overlay">
                            <i class="fas fa-camera"></i>
                        </label>
                        <input type="file" id="profile-upload" accept="image/*" style="display: none;">
                    </div>
                    <h3 class="dropdown-user-name">${user.name}</h3>
                    <p class="dropdown-user-email">${user.email}</p>
                </div>
                <div class="dropdown-body">
                    <a href="#" class="dropdown-item" data-action="account">
                        <i class="fas fa-user"></i> Mon Compte
                    </a>
                    <a href="#" class="dropdown-item" data-action="subscription">
                        <i class="fas fa-crown"></i> Abonnement
                    </a>
                    <hr>
                    <a href="#" class="dropdown-item logout-btn">
                        <i class="fas fa-sign-out-alt"></i> Déconnexion
                    </a>
                </div>
            </div>
        </div>
    `;

    // Ajouter la section utilisateur
    navButtons.appendChild(userSection);

    // Ajouter le badge fondateur si applicable
    if (user.role === "founder") {
        const userName = userSection.querySelector('.user-name');
        userName.innerHTML = `${user.name} <span class="founder-badge">Fondateur</span>`;
    }

    // Gérer les événements du menu utilisateur
    const userProfile = userSection.querySelector('.user-profile');
    const profileDropdown = userSection.querySelector('.profile-dropdown');
    
    userProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });

    // Gérer la déconnexion
    const logoutBtn = userSection.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Gestion des boutons de connexion/inscription dans la navigation
    const loginBtn = document.querySelector('nav .login-btn');
    const signupBtn = document.querySelector('nav .signup-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const loginModal = document.querySelector('.login-modal');
            if (loginModal) loginModal.classList.add('active');
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            const signupModal = document.querySelector('.signup-modal');
            if (signupModal) signupModal.classList.add('active');
        });
    }

    // Gestion du formulaire de connexion
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = loginForm.querySelector('[name="email"]').value;
            const password = loginForm.querySelector('[name="password"]').value;

            // Vérifier si c'est le compte fondateur
            if (email === FOUNDER_EMAIL && password === FOUNDER_PASSWORD) {
                const user = {
                    email: FOUNDER_EMAIL,
                    name: "Fondateur",
                    role: "founder"
                };
                
                localStorage.setItem('user', JSON.stringify(user));
                document.querySelector('.login-modal').classList.remove('active');
                updateUIForLoggedUser(user);
                return;
            }

            // Pour les utilisateurs normaux
            const user = {
                email: email,
                name: email.split('@')[0],
                role: "user"
            };

            localStorage.setItem('user', JSON.stringify(user));
            document.querySelector('.login-modal').classList.remove('active');
            updateUIForLoggedUser(user);
        });
    }

    // Gestion de l'inscription
    const signupForm = document.querySelector('#signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = {
                email: signupForm.querySelector('[name="email"]').value,
                name: signupForm.querySelector('[name="name"]').value,
                role: "user"
            };
            localStorage.setItem('user', JSON.stringify(user));
            signupForm.closest('.modal').classList.remove('active');
            updateUIForLoggedUser(user);
            alert('Compte créé avec succès !');
        });
    }

    // Gestion des boutons d'abonnement
    const subscriptionButtons = document.querySelectorAll('.subscription-btn');
    subscriptionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const plan = button.getAttribute('data-plan');
            const currentUser = JSON.parse(localStorage.getItem('user'));

            if (!currentUser) {
                alert('Veuillez vous connecter pour choisir un abonnement');
                document.querySelector('.login-modal').classList.add('active');
                return;
            }

            const subscriptionModal = document.querySelector('.subscription-modal');
            const planDetails = {
                basic: { name: 'Basic', price: '9.99€/mois' },
                premium: { name: 'Premium', price: '19.99€/mois' },
                pro: { name: 'Pro', price: '50€/∞' }
            };

            if (planDetails[plan]) {
                subscriptionModal.querySelector('.plan-name').textContent = planDetails[plan].name;
                subscriptionModal.querySelector('.plan-price').textContent = planDetails[plan].price;
            }

            subscriptionModal.classList.add('active');
        });
    });

    // Gestion des modales
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').classList.remove('active');
        });
    });

    // Gestion des boutons de switch entre modales
    document.querySelectorAll('.switch-modal').forEach(button => {
        button.addEventListener('click', () => {
            const currentModal = button.closest('.modal');
            const targetModal = currentModal.classList.contains('login-modal') ? 
                document.querySelector('.signup-modal') : 
                document.querySelector('.login-modal');
            currentModal.classList.remove('active');
            targetModal.classList.add('active');
        });
    });

    // Vérifier si un utilisateur est déjà connecté au chargement
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        updateUIForLoggedUser(JSON.parse(savedUser));
    }
});

// Fonction de déconnexion
function handleLogout() {
    localStorage.removeItem('user');
    window.location.reload();
} 