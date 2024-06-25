const DBAbstraction = require('../database/db');
const checkIdentification = async (identification) => {
    try {
        const query = 'SELECT * FROM Instructor WHERE identification = ?';
        const row = await DBAbstraction.get(query, [identification]);
        return row;
    }
    catch (err){
        throw err;
    }
};

module.exports = {
    checkIdentification
};