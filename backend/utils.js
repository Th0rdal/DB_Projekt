const db = require('../database/db');

function generateUniqueIdentification() {
    return new Promise((resolve, reject) => {
        const identification = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-stellige Zahl

        const checkIdentificationQuery = 'SELECT Identification FROM Instructor WHERE Identification = ?';
        db.get(checkIdentificationQuery, [identification], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                generateUniqueIdentification().then(resolve).catch(reject);
            } else {
                resolve(identification);
            }
        });
    });
}

module.exports = {
    generateUniqueIdentification
};
