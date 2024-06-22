const db = require('../database/db');
const checkIdentification = (identification) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Instructor WHERE identification = ?';
        db.get(query, [identification], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

module.exports = {
    checkIdentification
};