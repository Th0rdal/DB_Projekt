const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const registerRoutes = require('./register');
const loginRoutes = require('./login'); // Importiere die Login-Routen

//const db = require('../database/db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Statische Dateien aus dem build-Verzeichnis der React-Anwendung bedienen
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.use('/', registerRoutes);
app.use('/', loginRoutes);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
