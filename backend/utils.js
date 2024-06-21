const db = require('../database/db');

function generateUniqueIdentification(callback) {
    const identification = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-stellige Zahl

    const checkIdentificationQuery = 'SELECT Identification FROM Instructor WHERE Identification = ?';
    db.get(checkIdentificationQuery, [identification], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        if (row) {
            // Wenn die Identifikationsnummer bereits existiert, generiere eine neue
            generateUniqueIdentification(callback);
        } else {
            // Wenn die Identifikationsnummer einzigartig ist, gib sie zurück
            callback(null, identification);
        }
    });
}

module.exports = {
    generateUniqueIdentification
};
