const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const { generateUniqueIdentification } = require('./utils');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Statische Dateien aus dem build-Verzeichnis der React-Anwendung bedienen
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.post('/register', (req, res) => {
    const { SVNR, firstName, lastName, phoneNr1, phoneNr2, ZIP, street, city, streetNr, accountBalance, accountNr, BLZ} = req.body;

    if (!SVNR || !firstName || !lastName || !phoneNr1 || !ZIP || !street || !city || !streetNr || !accountBalance || !accountNr || !BLZ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    //check if BLZ exists
    const checkBLZQuery = 'SELECT BankName FROM BankName Bank WHERE BLZ = ?';
    db.get(checkBLZQuery, [BLZ], (err, row) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        if (!row) {
            return res.status(400).json({error: 'BLZ does not exist in the BankName table'});
        }


        //generate Unique Identification for Instructor (use as SessionID later)

        //get hiringDate
        generateUniqueIdentification((err, identification) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const employeeQuery = `INSERT INTO Employee (Identification, SVNR, AccountBalance, AccountNr, BLZ)
                   VALUES (?, ?, ?, ?, ?)`;


            db.run(employeeQuery, [identification, SVNR, accountBalance])


            const personQuery = `INSERT INTO Person (SVNR, firstName, lastName, phoneNr1, phoneNr2, ZIP, street, city, streetNr)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.run(personQuery, [SVNR, firstName, lastName, phoneNr1, phoneNr2 || null, ZIP, street, city, streetNr], function(err) {
                if (err) {
                    return res.status(500).json({error: err.message});
                }
                res.status(200).json({message: 'User registered successfully', data: req.body});
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
