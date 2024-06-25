const DBManager = require('./DBManager');
class DBAbstraction {

    static async get(query, variables) {
        const db = DBManager.getInstance();
        const connection = await db.getConnection();
        let resultSet = null;
        try {
            const stmt = connection.prepare(query);
            resultSet = stmt.get(variables);
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            db.returnConnection(connection);
        }

        return resultSet;
    }

    static async all(query, variables) {
        const db = DBManager.getInstance();
        const connection = await db.getConnection();
        let resultSet = null;
        try {
            const stmt = connection.prepare(query);
            resultSet = stmt.all(variables);
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            db.returnConnection(connection);
        }

        return resultSet;
    }

    static async run(query, variables) {
        const db = DBManager.getInstance();
        const connection = await db.getConnection();
        let resultSet = null;
        try {
            const stmt = connection.prepare(query);
            resultSet = stmt.run(variables);
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            db.returnConnection(connection);
        }

        return resultSet;
    }
}

module.exports = DBAbstraction;


