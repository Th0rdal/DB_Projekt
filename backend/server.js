const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const registerRoutes = require('./register');
const loginRoutes = require('./login'); // Importiere die Login-Routen
const createRoutes = require('./create');

//const db = require('../database/db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Statische Dateien aus dem build-Verzeichnis der React-Anwendung bedienen
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.use('/', registerRoutes);
app.use('/', loginRoutes);
app.use('/', createRoutes);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
