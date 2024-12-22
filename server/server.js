const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();

// Configuration de la protection DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite chaque IP à 100 requêtes par fenêtre
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});

// Middleware de sécurité
app.use(helmet());
app.use(limiter);

// Protection contre les attaques par force brute
const bruteForceProtection = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 5, // 5 tentatives
    message: 'Trop de tentatives de connexion, compte temporairement bloqué.'
});

app.use('/login', bruteForceProtection);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
}); 