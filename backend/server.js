const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const {generateUniqueIdentification} = require('./utils');

const db = require('../database/db');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Statische Dateien aus dem build-Verzeichnis der React-Anwendung bedienen
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.get('/get_BLZ', async (req, res) => {
    try {
        const getAllBLZ = () => {
            return new Promise((resolve, reject) => {
                const query = 'SELECT BLZ FROM BankName';
                db.all(query, [], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        };

        const blzList = await getAllBLZ();
        res.status(200).json(blzList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/register', async (req, res) => {
    const {
        SVNR,
        firstName,
        lastName,
        phoneNr1,
        phoneNr2,
        ZIP,
        street,
        city,
        streetNr,
        accountBalance,
        accountNr,
        BLZ
    } = req.body;

    if (!SVNR || !firstName || !lastName || !phoneNr1 || !ZIP || !street || !city || !streetNr || !accountBalance || !accountNr || !BLZ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const checkBLZ = (BLZ) => {
            return new Promise((resolve, reject) => {
                const query = 'SELECT BankName FROM BankName WHERE BLZ = ?';
                db.get(query, [BLZ], (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
        };

        const insertPerson = (SVNR, firstName, lastName, phoneNr1, phoneNr2, ZIP, street, city, streetNr) => {
            return new Promise((resolve, reject) => {
                const query = `INSERT INTO Person (SVNR, firstName, lastName, phoneNr1, phoneNr2, ZIP, street, city, streetNr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                db.run(query, [SVNR, firstName, lastName, phoneNr1, phoneNr2 || null, ZIP, street, city, streetNr], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };

        const insertEmployee = (SVNR, accountBalance, accountNr, BLZ) => {
            return new Promise((resolve, reject) => {
                const query = `INSERT INTO Employee (SVNR, AccountBalance, AccountNr, BLZ) VALUES (?, ?, ?, ?)`;
                db.run(query, [SVNR, accountBalance, accountNr, BLZ], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };

        const insertInstructor = (identification, currentDate, SVNR) => {
            return new Promise((resolve, reject) => {
                const query = `INSERT INTO Instructor (Identification, HiringDate, SVNR) VALUES (?, ?, ?)`;
                db.run(query, [identification, currentDate, SVNR], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };

        const BLZRow = await checkBLZ(BLZ);
        if (!BLZRow) {
            return res.status(400).json({ error: 'BLZ does not exist in the BankName table' });
        }

        const identification = await generateUniqueIdentification();
        const currentDate = new Date();

        await insertPerson(SVNR, firstName, lastName, phoneNr1, phoneNr2, ZIP, street, city, streetNr);
        await insertEmployee(SVNR, accountBalance, accountNr, BLZ);
        await insertInstructor(identification, currentDate, SVNR);

        res.status(200).json({ message: 'User registered successfully', data: req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
