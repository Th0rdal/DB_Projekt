
const DBConnection = require('better-sqlite3');
const path = require('path');
const Stack = require('./stack');
const MAX_CONNECTIONS = 10;

class DBManager {
    static instance = null;
    constructor() {
        const dbPath = path.resolve(__dirname, '../resources/db/database.db');
        this.dbConnection = new DBConnection(dbPath);
        this.waitingPromises = [];
        this.connectionStack = new Stack();

        // create db connections
        for (let i = 0; i < MAX_CONNECTIONS; i++) {
            this.connectionStack.push(new DBConnection(dbPath));
        }
    }

    static getInstance() {
        if (!DBManager.instance) {
            DBManager.instance = new DBManager();
        }
        return DBManager.instance;
    }

    async getConnection() {
        if (this.connectionStack.isEmpty()) {
            await new Promise(resolve => {
                this.waitingPromises.push(resolve);
            });
        }
        return this.connectionStack.pop();
    }

    returnConnection(connection) {
        this.connectionStack.push(connection);
        if (this.waitingPromises.length > 0) {
            const resolveFunc = this.waitingPromise.shift();
            resolveFunc();
        }
    }
}

module.exports = DBManager;