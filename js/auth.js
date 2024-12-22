document.addEventListener('DOMContentLoaded', () => {
    // Sélecteurs
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const loginModal = document.querySelector('.login-modal');
    const signupModal = document.querySelector('.signup-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const switchButtons = document.querySelectorAll('.switch-modal');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Ouvrir les modales
    loginBtn?.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    signupBtn?.addEventListener('click', () => {
        signupModal.classList.add('active');
    });

    // Fermer les modales
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });

    // Changer entre login et signup
    switchButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentModal = btn.closest('.modal');
            const targetModal = document.querySelector('.' + btn.dataset.target + '-modal');
            if (currentModal && targetModal) {
                currentModal.classList.remove('active');
                targetModal.classList.add('active');
            }
        });
    });

    // Gérer la soumission du formulaire de connexion
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await fetch('https://api.zenohelper.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Identifiants invalides');
            }

            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            
            // Fermer la modal de connexion
            document.querySelector('.login-modal').classList.remove('active');
            
            // Mettre à jour l'interface utilisateur
            updateUIForLoggedUser(data.user);

        } catch (error) {
            // Afficher un message d'erreur plus convivial
            const errorMessage = document.createElement('p');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Email ou mot de passe incorrect';
            
            // Supprimer l'ancien message d'erreur s'il existe
            const oldError = e.target.querySelector('.error-message');
            if (oldError) oldError.remove();
            
            // Ajouter le nouveau message d'erreur
            e.target.insertBefore(errorMessage, e.target.firstChild);
        }
    });

    // Gérer la soumission du formulaire d'inscription
    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            'password-confirm': formData.get('password-confirm')
        };

        try {
            const response = await Api.signup(data);
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('token', response.token);
                signupModal.classList.remove('active');
                updateUIForLoggedUser(response.user);
            }
        } catch (error) {
            alert(error.message);
        }
    });

    // Vérifier si un utilisateur est déjà connecté
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        updateUIForLoggedUser(JSON.parse(savedUser));
    }

    // Gérer les clics sur les boutons d'abonnement
    const subscriptionBtns = document.querySelectorAll('.subscription-btn');
    const subscriptionModal = document.querySelector('.subscription-modal');
    const planName = document.querySelector('.plan-name');
    const planPrice = document.querySelector('.plan-price');
    const paymentForm = document.getElementById('payment-form');

    const plans = {
        basic: { name: 'Basic', price: '9.99€/mois' },
        premium: { name: 'Premium', price: '19.99€/mois' },
        pro: { name: 'Pro', price: '29.99€/mois' }
    };

    // Définir les fonctionnalités pour chaque plan
    const planFeatures = {
        basic: [
            'Optimisation de base',
            'Nettoyage mensuel',
            'Support par email'
        ],
        premium: [
            'Optimisation avancée',
            'Nettoyage hebdomadaire',
            'Support prioritaire 24/7',
            'Sauvegarde automatique',
            'Protection en temps réel',
            'Mises à jour automatiques'
        ],
        pro: [
            'Tout Premium inclus',
            'Optimisation personnalisée',
            'Support dédié',
            'Analyse approfondie',
            'Rapport détaillé mensuel',
            'Configuration sur mesure'
        ]
    };

    // Mettre à jour les fonctionnalités affichées dans la modale
    function updateSubscriptionModal(plan) {
        const planName = document.querySelector('.plan-name');
        const planPrice = document.querySelector('.plan-price');
        const featuresList = document.getElementById('selected-features');
        
        // Mettre à jour le nom et le prix
        planName.textContent = plan.charAt(0).toUpperCase() + plan.slice(1);
        const prices = {
            basic: '9.99€/mois',
            premium: '19.99€/mois',
            pro: '29.99€/mois'
        };
        planPrice.textContent = prices[plan];
        
        // Mettre à jour les fonctionnalités
        featuresList.innerHTML = planFeatures[plan]
            .map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`)
            .join('');
    }

    subscriptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.dataset.plan;
            updateSubscriptionModal(plan);
            subscriptionModal.classList.add('active');
        });
    });

    paymentForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(paymentForm);
        
        try {
            // Rediriger vers PayPal
            window.location.href = 'https://www.paypal.com/paypalme/suzuya23655';
            // Après le paiement, rediriger vers les instructions
            window.location.href = 'payment-instructions.html';
        } catch (error) {
            alert('Erreur lors du traitement du paiement. Veuillez réessayer.');
        }
    });
});

// Fonction pour mettre à jour l'interface utilisateur
function updateUIForLoggedUser(user) {
    const navButtons = document.querySelector('nav ul');
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
}

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
            accountForm.onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(accountForm);
                try {
                    const response = await Api.updateAccount({
                        name: formData.get('name'),
                        email: formData.get('email')
                    });
                    if (response.user) {
                        localStorage.setItem('user', JSON.stringify(response.user));
                        updateUIForLoggedUser(response.user);
                        accountModal.classList.remove('active');
                        alert('Informations mises à jour avec succès');
                    }
                } catch (error) {
                    alert(error.message);
                }
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
                    pro: { name: 'Pro', price: '29.99€/mois' }
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
