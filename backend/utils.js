const db = require('../database/db');

function generateUniqueIdentification() {
    return new Promise((resolve, reject) => {
        const identification = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-stellige Zahl

        const checkIdentificationQuery = 'SELECT Identification FROM instructor WHERE Identification = ?';
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

function generateUniqueEmployeeNr() {
    return new Promise((resolve, reject) => {
        const identification = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-stellige Zahl

        const checkIdentificationQuery = 'SELECT employeeNR FROM instructor WHERE Identification = ?';
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

// function generateUniqueScriptNr() {
//     return new Promise((resolve, reject) => {
//         const number = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-stellige Zahl
//
//         const checkIdentificationQuery = 'SELECT Identification FROM ScriptType WHERE Number = ?';
//         db.get(checkIdentificationQuery, [number], (err, row) => {
//             if (err) {
//                 reject(err);
//             } else if (row) {
//                 generateUniqueIdentification().then(resolve).catch(reject);
//             } else {
//                 resolve(number);
//             }
//         });
//     });
// }

module.exports = {
    generateUniqueIdentification,
    generateUniqueEmployeeNr
    //generateUniqueScriptNr
};
