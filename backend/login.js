const express = require('express');
const router = express.Router();
const DBAbstraction = require('../database/db');

const getUserBySVNR = async (SVNR) => {
    try {
        const query = 'SELECT * FROM Person WHERE SVNR = ?';
        const row = await DBAbstraction.get(query, [SVNR]);
        return row;
    }
    catch (err){
        throw err;
    }

};

const getIdentificationBySVNR = async (SVNR) => {
    try {
        const query = 'SELECT Identification FROM instructor WHERE SVNR = ?';
        const row = await DBAbstraction.get(query, [SVNR]);
        if (row) {
            return row.Identification;
        }
        return null;
    } catch (err) {
        throw err;
    }
};


router.post('/login', async (req, res) => {
    const { SVNR } = req.body;

    if (!SVNR) { //alles richtig im formular angegeben?
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const user = await getUserBySVNR(SVNR); //checken ob es SVNR gibt
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const identification = await getIdentificationBySVNR(SVNR); //identification für cookie holen
        if (!identification) {
            return res.status(404).json({ error: 'Identification not found' });
        }
        console.log(identification)

        res.cookie('identification', identification, { httpOnly: true, secure: true, sameSite: 'Strict' });

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("identification", {path: "/"});
    res.status(200).json({message: "Lougout successful"});
});

module.exports = router;