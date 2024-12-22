const FOUNDER_EMAIL = "suzuya23655@gmail.com"; // Email du fondateur
const FOUNDER_PASSWORD = "ZenoFounder2024"; // Mot de passe du fondateur

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
        
        // Ajouter les événements aux boutons
        const loginBtn = document.querySelector('.login-btn');
        const signupBtn = document.querySelector('.signup-btn');
        const loginModal = document.querySelector('.login-modal');
        const signupModal = document.querySelector('.signup-modal');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                loginModal.classList.add('active');
            });
        }

        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                signupModal.classList.add('active');
            });
        }
        return;
    }

    // Supprimer TOUS les anciens profils s'ils existent
    const existingUserSections = document.querySelectorAll('.user-section');
    existingUserSections.forEach(section => section.remove());

    // Supprimer les anciens boutons de connexion/inscription
    const navBtns = document.querySelectorAll('.nav-btn'); // Renommé pour éviter le conflit
    navBtns.forEach(btn => {
        if (btn.parentElement) {
            btn.parentElement.remove();
        }
    });

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

    // Remplacer les boutons login/signup
    const authButtons = navButtons.querySelectorAll('.nav-btn');
    authButtons.forEach(btn => btn.parentElement.remove());
    navButtons.appendChild(userSection);

    // Gérer le clic sur le profil
    const userProfile = userSection.querySelector('.user-profile');
    const profileDropdown = userSection.querySelector('.profile-dropdown');
    
    userProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });

    // Fermer le dropdown en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target) && !userProfile.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });

    // Gérer le changement de photo
    const profileUpload = userSection.querySelector('#profile-upload');
    profileUpload.addEventListener('change', handleProfilePicUpload);

    // Gérer les actions du menu
    const dropdownItems = userSection.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.classList.contains('logout-btn')) {
                handleLogout();
            } else {
                handleDropdownAction(item.dataset.action);
            }
        });
    });

    // Ajouter le badge fondateur si applicable
    if (user.role === "founder") {
        const userName = userSection.querySelector('.user-name');
        userName.innerHTML = `${user.name} <span class="founder-badge">Fondateur</span>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Sélecteurs pour les modales
    const loginModal = document.querySelector('.login-modal');
    const signupModal = document.querySelector('.signup-modal');

    // Fonction pour attacher les événements aux boutons
    function attachButtonEvents() {
        // Sélectionner tous les boutons de connexion et d'inscription
        const loginButtons = document.querySelectorAll('.login-btn');
        const signupButtons = document.querySelectorAll('.signup-btn');

        // Attacher les événements aux boutons de connexion
        loginButtons.forEach(button => {
            button.onclick = () => {
                if (loginModal) loginModal.classList.add('active');
            };
        });

        // Attacher les événements aux boutons d'inscription
        signupButtons.forEach(button => {
            button.onclick = () => {
                if (signupModal) signupModal.classList.add('active');
            };
        });
    }

    // Attacher les événements immédiatement
    attachButtonEvents();

    // Vérifier si un utilisateur est connecté
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
        const navButtons = document.querySelector('nav ul');
        if (navButtons) {
            navButtons.innerHTML = `
                <li><a href="#features">Fonctionnalités</a></li>
                <li><a href="#pricing">Abonnements</a></li>
                <li><a href="https://discord.gg/Wk28VF68s7">Contact</a></li>
                <li><button class="nav-btn login-btn">Connexion</button></li>
                <li><button class="nav-btn signup-btn">Inscription</button></li>
            `;
            // Réattacher les événements après avoir ajouté les nouveaux boutons
            attachButtonEvents();
        }
    } else {
        updateUIForLoggedUser(JSON.parse(savedUser));
    }

    // Gérer la fermeture des modales
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.onclick = () => {
            const modal = btn.closest('.modal');
            if (modal) modal.classList.remove('active');
        };
    });

    // Gérer le switch entre les modales
    const switchButtons = document.querySelectorAll('.switch-modal');
    switchButtons.forEach(btn => {
        btn.onclick = () => {
            const currentModal = btn.closest('.modal');
            if (currentModal) {
                currentModal.classList.remove('active');
                const targetModal = currentModal.classList.contains('login-modal') ? signupModal : loginModal;
                if (targetModal) targetModal.classList.add('active');
            }
        };
    });
});

function handleProfilePicUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            // Sauvegarder l'image dans le localStorage
            localStorage.setItem('profilePic', imageUrl);
            // Mettre à jour toutes les images de profil
            const profilePics = document.querySelectorAll('.profile-pic img, .profile-pic-large img');
            profilePics.forEach(pic => {
                pic.src = imageUrl;
            });
        }
        reader.readAsDataURL(file);
    }
}

function handleDropdownAction(action) {
    switch(action) {
        case 'account':
            const accountModal = document.querySelector('.account-modal');
            const user = JSON.parse(localStorage.getItem('user'));
            
            // Pré-remplir les champs avec les informations actuelles
            document.getElementById('account-name').value = user.name;
            document.getElementById('account-email').value = user.email;
            
            // Afficher la modale
            accountModal.classList.add('active');
            
            // Gérer la soumission du formulaire des informations personnelles
            const accountForm = document.getElementById('account-form');
            accountForm.onsubmit = (e) => {
                e.preventDefault();
                const formData = new FormData(accountForm);
                const newName = formData.get('name');
                
                // Créer un nouvel objet utilisateur avec le nouveau nom
                const updatedUser = {
                    ...user,  // Garder toutes les propriétés existantes
                    name: newName  // Mettre à jour uniquement le nom
                };
                
                // Sauvegarder dans le localStorage
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // Mettre à jour l'interface
                updateUIForLoggedUser(updatedUser);
                
                // Fermer la modale
                accountModal.classList.remove('active');
                
                // Message de succès
                alert('Nom mis à jour avec succès !');
            };

            // Gérer la soumission du formulaire de changement de mot de passe
            const passwordForm = document.getElementById('password-form');
            passwordForm.onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(passwordForm);
                if (formData.get('new-password') !== formData.get('confirm-password')) {
                    alert('Les nouveaux mots de passe ne correspondent pas');
                    return;
                }
                try {
                    await Api.updatePassword({
                        oldPassword: formData.get('old-password'),
                        newPassword: formData.get('new-password')
                    });
                    passwordForm.reset();
                    alert('Mot de passe mis à jour avec succès');
                } catch (error) {
                    alert(error.message);
                }
            };

            // Gérer la suppression du compte
            const deleteBtn = document.querySelector('.delete-account-btn');
            deleteBtn.onclick = async () => {
                if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                    try {
                        await Api.deleteAccount();
                        handleLogout();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            };
            break;
            
        case 'subscription':
            const subscriptionModal = document.querySelector('.subscription-modal');
            const currentUser = JSON.parse(localStorage.getItem('user'));
            
            // Afficher le plan actuel si l'utilisateur en a un
            if (currentUser && currentUser.subscription) {
                const planName = document.querySelector('.plan-name');
                const planPrice = document.querySelector('.plan-price');
                const plans = {
                    basic: { name: 'Basic', price: '9.99€/mois' },
                    premium: { name: 'Premium', price: '19.99€/mois' },
                    pro: { name: 'Pro', price: '50€/∞' }
                };
                
                if (plans[currentUser.subscription]) {
                    planName.textContent = plans[currentUser.subscription].name;
                    planPrice.textContent = plans[currentUser.subscription].price;
                }
            }
            
            subscriptionModal.classList.add('active');
            break;
    }
}

function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Ne pas supprimer la photo de profil
    // localStorage.removeItem('profilePic');
    window.location.reload();
}

// Fonction pour ouvrir les modales
function openModal(modalType) {
    const modal = document.querySelector(`.${modalType}-modal`);
    if (modal) {
        modal.classList.add('active');
    }
} 