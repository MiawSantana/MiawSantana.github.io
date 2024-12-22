class Api {
    static get users() {
        // Récupérer les utilisateurs du localStorage ou retourner un tableau vide
        const savedUsers = localStorage.getItem('users');
        return savedUsers ? JSON.parse(savedUsers) : [];
    }

    static set users(users) {
        // Sauvegarder les utilisateurs dans le localStorage
        localStorage.setItem('users', JSON.stringify(users));
    }

    static async login(credentials) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = this.users;
                const user = users.find(u => u.email === credentials.email);
                
                if (user && user.password === credentials.password) {
                    resolve({
                        token: 'token_' + Math.random(),
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    });
                } else {
                    reject(new Error('Email ou mot de passe incorrect'));
                }
            }, 500);
        });
    }

    static async signup(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = this.users;
                
                if (users.find(u => u.email === userData.email)) {
                    reject(new Error('Cet email est déjà utilisé'));
                    return;
                }

                if (userData.password !== userData['password-confirm']) {
                    reject(new Error('Les mots de passe ne correspondent pas'));
                    return;
                }

                const newUser = {
                    id: Date.now(),
                    name: userData.name,
                    email: userData.email,
                    password: userData.password
                };

                // Ajouter le nouvel utilisateur et sauvegarder
                users.push(newUser);
                this.users = users;

                resolve({
                    token: 'token_' + Math.random(),
                    user: {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email
                    }
                });
            }, 500);
        });
    }

    static async updateAccount(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = this.users;
                const user = users.find(u => u.email === userData.email);
                
                if (user) {
                    user.name = userData.name;
                    user.email = userData.email;
                    this.users = users;
                    
                    resolve({
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    });
                } else {
                    reject(new Error('Utilisateur non trouvé'));
                }
            }, 500);
        });
    }

    static async updatePassword(passwordData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = this.users;
                const user = users.find(u => u.password === passwordData.oldPassword);
                
                if (user) {
                    user.password = passwordData.newPassword;
                    this.users = users;
                    resolve({ success: true });
                } else {
                    reject(new Error('Ancien mot de passe incorrect'));
                }
            }, 500);
        });
    }

    static async deleteAccount() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = this.users;
                const userIndex = users.findIndex(u => u.email === JSON.parse(localStorage.getItem('user')).email);
                
                if (userIndex !== -1) {
                    users.splice(userIndex, 1);
                    this.users = users;
                    resolve({ success: true });
                } else {
                    reject(new Error('Utilisateur non trouvé'));
                }
            }, 500);
        });
    }
} 
