// Système de sécurité
class SecuritySystem {
    constructor() {
        this.loginAttempts = new Map();
        this.maxLoginAttempts = 5;
        this.blockDuration = 30 * 60 * 1000; // 30 minutes
        this.initSecurityListeners();
    }

    // Initialiser les écouteurs de sécurité
    initSecurityListeners() {
        // Protection contre le clickjacking
        if (window.self !== window.top) {
            window.top.location = window.self.location;
        }

        // Protection XSS pour les entrées
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = this.sanitizeInput(e.target.value);
            });
        });

        // Protection contre les attaques par force brute
        document.querySelector('#login-form')?.addEventListener('submit', (e) => {
            const email = e.target.querySelector('[name="email"]').value;
            if (!this.checkLoginAttempts(email)) {
                e.preventDefault();
                alert('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
            }
        });

        // Vérification de la force du mot de passe
        document.querySelectorAll('input[type="password"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        });

        // Protection contre la manipulation du localStorage
        this.protectLocalStorage();
    }

    // Nettoyer les entrées utilisateur
    sanitizeInput(input) {
        return input.replace(/[<>]/g, '').trim();
    }

    // Vérifier les tentatives de connexion
    checkLoginAttempts(email) {
        if (!this.loginAttempts.has(email)) {
            this.loginAttempts.set(email, {
                count: 1,
                timestamp: Date.now()
            });
            return true;
        }

        const attempt = this.loginAttempts.get(email);
        const timePassed = Date.now() - attempt.timestamp;

        if (timePassed > this.blockDuration) {
            this.loginAttempts.delete(email);
            return true;
        }

        if (attempt.count >= this.maxLoginAttempts) {
            return false;
        }

        attempt.count++;
        return true;
    }

    // Vérifier la force du mot de passe
    checkPasswordStrength(password) {
        const strengthBar = document.createElement('div');
        strengthBar.className = 'password-strength-bar';
        
        const criteria = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };

        const strength = Object.values(criteria).filter(Boolean).length;
        const strengthText = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'][strength - 1] || 'Invalide';
        
        strengthBar.innerHTML = `
            <div class="strength-meter" style="width: ${strength * 20}%"></div>
            <span>${strengthText}</span>
        `;

        return strength >= 3;
    }

    // Protéger le localStorage
    protectLocalStorage() {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            // Vérifier si la valeur est un JSON valide
            try {
                if (typeof value === 'string') {
                    JSON.parse(value);
                }
            } catch (e) {
                console.error('Tentative d\'injection détectée');
                return;
            }
            originalSetItem.apply(this, arguments);
        };
    }

    // Générer un token de session
    generateSessionToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
}

// Initialiser le système de sécurité
const security = new SecuritySystem();

// Ajouter le CSS pour la barre de force du mot de passe
const style = document.createElement('style');
style.textContent = `
    .password-strength-bar {
        margin-top: 5px;
        background: #f0f0f0;
        border-radius: 4px;
        height: 10px;
        position: relative;
    }

    .strength-meter {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
        background: linear-gradient(90deg, #ff4444 0%, #ffbb33 50%, #00C851 100%);
    }

    .strength-meter + span {
        font-size: 12px;
        color: #666;
        margin-left: 10px;
    }
`;
document.head.appendChild(style); 