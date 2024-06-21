const express = require('express');
const router = express.Router();
const db = require('../database/db');

const getUserBySVNR = (SVNR) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Person WHERE SVNR = ?';
        db.get(query, [SVNR], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const getIdentificationBySVNR = (SVNR) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT Identification FROM Instructor WHERE SVNR = ?';
        db.get(query, [SVNR], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};


router.post('/login', async (req, res) => {
    const { SVNR } = req.body;

    if (!SVNR) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const user = await getUserBySVNR(SVNR);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const identification = await getIdentificationBySVNR(SVNR);
        if (!identification) {
            return res.status(404).json({ error: 'Identification not found' });
        }

        res.cookie('identification', identification, { httpOnly: true, secure: true, sameSite: 'Strict' });

        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;