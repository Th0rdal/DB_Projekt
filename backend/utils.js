const DBAbstraction = require('../database/db');

async function generateUniqueIdentification() {
    const identification = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-stellige Zahl

    const checkIdentificationQuery = 'SELECT Identification FROM instructor WHERE Identification = ?';

    try {
        const row = await DBAbstraction.get(checkIdentificationQuery, [identification]);
        if (row) {
            return await generateUniqueIdentification();
        } else {
            return identification;
        }
    } catch (err) {
        throw err;
    }
}

async function generateUniqueEmployeeNr() {
    const employeeNR = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-stellige Zahl

    const checkIdentificationQuery = 'SELECT employeeNR FROM employee WHERE employeeNR = ?';

    try {
        const row = await DBAbstraction.get(checkIdentificationQuery, [employeeNR]);
        if (row) {
            return await generateUniqueEmployeeNr();
        } else {
            return employeeNR;
        }
    } catch (err) {
        throw err;
    }
}

const formatDate = (date) => {
    const padTo2Digits = (num) => num.toString().padStart(2, '0');

    return (
        date.getFullYear() +
        '-' +
        padTo2Digits(date.getMonth() + 1) +
        '-' +
        padTo2Digits(date.getDate()) +
        ' ' +
        padTo2Digits(date.getHours()) +
        ':' +
        padTo2Digits(date.getMinutes()) +
        ':' +
        padTo2Digits(date.getSeconds())
    );
};

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
    generateUniqueEmployeeNr,
    formatDate
    //generateUniqueScriptNr
};
