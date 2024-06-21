//NOCH OHNE SKRIPT PDF!!!

const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { checkIdentification } = require('./session');

// ++++++++++++++++++++++++++++ CREATE COURSES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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

        res.status(200).json({ message: 'created course successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ++++++++++++++++++++++++++++ CREATE ADDRESSES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const insertAddress = async (city, ZIP, street, streetNr) => {

    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Address (City, ZIP, Street, StreetNR) VALUES (?, ?, ?, ?)`;
        db.run(query, [city, ZIP, street, streetNr], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
router.post('/create_address', async (req, res) => {
    const { city, ZIP, street, streetNr } = req.body;
    const identification = req.cookies.identification;

    if (!identification) {
        return res.status(400).json({ error: 'Identification cookie is missing' });
    }
    if (!city || !ZIP || !street || !streetNr) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const identificationRow = await checkIdentification(identification);
        if (!identificationRow) {
            return res.status(400).json({ error: 'identification does not exist in the Instructor table' });
        }

        await insertAddress(city, ZIP, street, streetNr);

        res.status(200).json({ message: 'created address successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ++++++++++++++++++++++++++++ GET COURSES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const getAllCourses = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT CourseName FROM Course';
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

router.get('/get_courses', async (req, res) => {
    try {
        const courseList = await getAllCourses();
        res.status(200).json(courseList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ++++++++++++++++++++++++++++ GET ADDRESSES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const getAllAddresses = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Address';
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

router.get('/get_addresses', async (req, res) => {
    try {
        const addressList = await getAllAddresses();
        res.status(200).json(addressList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ++++++++++++++++++++++++++++ CREATE SEMINAR +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const insertSeminar = async (addressID, date, time, course) => {

    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Seminar (AddressID, Date, Time, Course) VALUES (?, ?, ?, ?)`;
        db.run(query, [addressID, date, time, course], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
router.post('/create_seminar', async (req, res) => {
    const { addressID, date, time, course } = req.body;
    const identification = req.cookies.identification;

    if (!identification) {
        return res.status(400).json({ error: 'Identification cookie is missing' });
    }
    if (!addressID || !date || !time || !course) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const identificationRow = await checkIdentification(identification);
        if (!identificationRow) {
            return res.status(400).json({ error: 'identification does not exist in the Instructor table' });
        }

        await insertSeminar(addressID, date, time, course);

        res.status(200).json({ message: 'created seminar successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;