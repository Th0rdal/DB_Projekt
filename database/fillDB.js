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
        Bankname TEXT NOT NULL    
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
        employeeNr INTEGER,    
        accountNr INTEGER,
        BLZ INTEGER,
        PRIMARY KEY (SVNR),
        FOREIGN KEY (SVNR) REFERENCES person(SVNR),
        FOREIGN KEY (accountNr) REFERENCES bankAccount(accountNR),
        FOREIGN KEY (BLZ) REFERENCES bankname(BLZ)
    )    
`;

const createInstructorTable = `
    CREATE TABLE IF NOT EXISTS instructor(
        SVNR INTEGER PRIMARY KEY,
        Identification INTEGER UNIQUE NOT NULL,
        HiringDate DATETIME NOT NULL,    
        FOREIGN KEY (SVNR) REFERENCES person(SVNR)
    )
`;

const createLanguageTable = `
    CREATE TABLE IF NOT EXISTS language(
        language TEXT PRIMARY KEY
    )
`

const createScripttypeTable = `
    CREATE TABLE IF NOT EXISTS scripttype(
        number INTEGER PRIMARY KEY,
        autor TEXT NOT NULL
    )
`

const createCourseTable = `
    CREATE TABLE IF NOT EXISTS course(
        coursename TEXT PRIMATE KEY,
        scripttype INTEGER,
        orgCount TINYINT,
        prepTime TIME,
        FOREIGN KEY (scripttype) REFERENCES scripttype(number)
    )
`

const createPresentCourseTable = `
    CREATE TABLE IF NOT EXISTS presentCourse(
        language TEXT,
        coursename TEXT,
        instructor INTEGER,
        PRIMARY KEY (language, coursename, instructor),
        FOREIGN KEY (language) REFERENCES language(language),
        FOREIGN KEY (coursename) REFERENCES course(coursename),  
        FOREIGN KEY (instructor) REFERENCES instructor(SVNR)  
    )
`

const createAddressTable = `
    CREATE TABLE IF NOT EXISTS address(
        addressID INTEGER PRIMARY KEY,
        ZIP INTEGER,
        Street TEXT,
        City TEXT,
        StreetNR INTEGER  
    )
`

const createSeminarTable = `
    CREATE TABLE IF NOT EXISTS seminar(
        addressID INTEGER,
        coursename TEXT,
        instructor INTEGER,
        date DATE,
        time TIME,
        PRIMARY KEY (date, time)
        FOREIGN KEY (addressID) REFERENCES seminar(addressID),
        FOREIGN KEY (coursename) REFERENCES course(coursename),
        FOREIGN KEY (instructor) REFERENCES instructor(SVNR)
    )
`

db.exec(createPersonTable);
db.exec(createBankNameTable);
db.exec(createBankAccountTable);
db.exec(createEmployeeTable);
db.exec(createInstructorTable);
db.exec(createLanguageTable);
db.exec(createScripttypeTable);
db.exec(createCourseTable);
db.exec(createPresentCourseTable);
db.exec(createAddressTable);
db.exec(createSeminarTable);

let stmt;

// fill language table with data
const languageInsert = `
    INSERT INTO language (language)
    VALUES (?)
`
stmt = db.prepare(languageInsert);
stmt.run("ENGLISH");
stmt.run("GERMAN");
stmt.run("SPANISH");
stmt.run("FRENCH");
stmt.run("CHINESE");

// fill bankname
const banknameInsert = `
    INSERT INTO bankname (BLZ, bankname)
    VALUES (?, ?)
`
stmt = db.prepare(banknameInsert);
stmt.run(123, "Bank 1");
stmt.run(456, "Bank 2");
stmt.run(789, "Bank 3");
