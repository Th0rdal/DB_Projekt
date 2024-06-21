//NOCH OHNE SKRIPT PDF!!!

const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { checkIdentification } = require('./session');

const checkCourseName = (courseName) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT CourseName FROM Course WHERE CourseName = ?';
        db.get(query, [courseName], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row ? true : false); // Wenn eine Zeile gefunden wurde, existiert der Kursname bereits
            }
        });
    });
};

const insertCourse = async (courseName, orgCount, prepTime) => {
    const exists = await checkCourseName(courseName);
    if (exists) {
        throw new Error('Course name already exists');
    }

    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Course (CourseName, OrgCount, PrepTime) VALUES (?, ?, ?)`;
        db.run(query, [courseName, orgCount, prepTime], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};


router.post('/create_course', async (req, res) => {
    const { courseName, orgCount, prepTime} = req.body;
    const identification = req.cookies.identification;

    if (!identification) {
        return res.status(400).json({ error: 'Identification cookie is missing' });
    }
    if (!courseName || !orgCount || !prepTime) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const identificationRow = await checkIdentification(identification);
        if (!identificationRow) {
            return res.status(400).json({ error: 'identification does not exist in the Instructor table' });
        }

        await insertCourse(courseName, orgCount, prepTime);

        res.status(200).json({ message: 'created course successfully!', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;