const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = path.resolve(__dirname, '../resources/db/database.db');
const dbFolderPath = path.resolve(__dirname, '../resources/db');

if (!fs.existsSync(dbFolderPath)) {
  fs.mkdirSync(dbFolderPath, { recursive: true });
}
fs.unlink(dbPath, (err) => {
    if (err) {
        console.log('No old db found:');
        return;
    }
    console.log('old Database file deleted');
});

const db = new Database(dbPath);

const createPersonTable = `
    CREATE TABLE IF NOT EXISTS person (
        SVNR INTEGER PRIMARY KEY,
        firstname TEXT,
        lastname TEXT,
        phoneNR1 BIGINT,
        phoneNR2 BIGINT,
        ZIP INTEGER,
        Street TEXT,
        City TEXT,
        StreetNR INTEGER  
    )
`;

const createBankNameTable = `
    CREATE TABLE IF NOT EXISTS bankname(
        BLZ INTEGER PRIMARY KEY,
        bankName TEXT NOT NULL    
    )
`;

const createBankAccountTable = `
    CREATE TABLE IF NOT EXISTS bankAccount(
        BLZ INTEGER,
        accountBalance INTEGER,
        accountNR BIGINT,
        PRIMARY KEY (accountNR, BLZ),
        FOREIGN KEY (BLZ) REFERENCES bankName(BLZ)
    )
`;

const createEmployeeTable = `
    CREATE TABLE IF NOT EXISTS employee(
        SVNR INTEGER,        
        employeeNR INTEGER,    
        accountNR BIGINT,
        BLZ INTEGER,
        PRIMARY KEY (SVNR),
        FOREIGN KEY (SVNR) REFERENCES person(SVNR),
        FOREIGN KEY (accountNR, BLZ) REFERENCES bankAccount(accountNR, BLZ)
    )    
`;

const createInstructorTable = `
    CREATE TABLE IF NOT EXISTS instructor(
        SVNR INTEGER PRIMARY KEY, 
        Identification INTEGER UNIQUE NOT NULL,
        HiringDate DATETIME NOT NULL,    
        FOREIGN KEY (SVNR) REFERENCES employee(SVNR)
    )
`;

const createScripttypeTable = `
    CREATE TABLE IF NOT EXISTS scriptType(
        number TEXT PRIMARY KEY,
        author TEXT NOT NULL
    )
`

const createCourseTable = `
    CREATE TABLE IF NOT EXISTS course(
        courseName TEXT PRIMARY KEY,
        scriptType TEXT,
        orgCount TINYINT,
        prepTime TIME,
        FOREIGN KEY (scriptType) REFERENCES scriptType(number)
    )
`

const createAddressTable = `
    CREATE TABLE IF NOT EXISTS address(
        addressID INTEGER PRIMARY KEY,
        ZIP INTEGER,
        street TEXT,
        city TEXT,
        streetNR INTEGER  
    )
`

const createSeminarTable = `
    CREATE TABLE IF NOT EXISTS seminar(
        addressID INTEGER,
        courseName TEXT,
        instructor INTEGER,
        date DATE,
        time TIME,
        PRIMARY KEY (date, time)
        FOREIGN KEY (addressID) REFERENCES address(addressID),
        FOREIGN KEY (courseName) REFERENCES course(courseName),
        FOREIGN KEY (instructor) REFERENCES instructor(SVNR)
    )
`

db.exec(createPersonTable);
db.exec(createBankNameTable);
db.exec(createBankAccountTable);
db.exec(createEmployeeTable);
db.exec(createInstructorTable);
db.exec(createScripttypeTable);
db.exec(createCourseTable);
db.exec(createAddressTable);
db.exec(createSeminarTable);

let stmt;

// fill bankname
const banknameInsert = `
    INSERT INTO bankname (BLZ, bankname)
    VALUES (?, ?)
`
stmt = db.prepare(banknameInsert);
stmt.run(123, "Bank 1");
stmt.run(456, "Bank 2");
stmt.run(789, "Bank 3");
