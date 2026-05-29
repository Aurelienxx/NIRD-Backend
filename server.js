require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const userRoutes = require('./src/User/route/userRoute');
const authRoutes = require('./src/Auth/route/authRoute');
const roleRoutes = require('./src/Role/route/roleRoute');
const pageRoutes = require('./src/Page/route/pageRoute');
const navGroupRoutes = require('./src/NavGroup/route/navGroupRoute');
const articleRoutes = require('./src/Article/route/articleRoute');
const documentRoutes = require('./src/Document/route/documentRoute');
const placeRoutes = require('./src/Place/route/placeRoute');

app.use(cors({
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Augmenter la limite de taille pour les requêtes JSON et les formulaires (jusqu'à 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/navgroups', navGroupRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/places', placeRoutes);
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));