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

// dummy data
const personInsert = `
    INSERT INTO PERSON (SVNR, firstname, lastname, phoneNR1, phoneNR2, zip, street, city, streetNR)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`

const bankaccountInsert = `
    INSERT INTO BANKACCOUNT (BLZ, accountBalance, accountNR)
    VALUES (?, ?, ?)
`

const employeeInsert = `
    INSERT INTO EMPLOYEE (SVNR, employeeNR, accountNR, BLZ)
    VALUES (?, ?, ?, ?)
`

const instructorInsert = `
    INSERT INTO INSTRUCTOR (SVNR, identification, hiringDate)
    VALUES (?, ?, ?)
`

const addressInsert = `
    INSERT INTO ADDRESS (addressID, zip, street, city, streetNR)
    VALUES (?, ?, ?, ?, ?)
`

const scryptTypeInsert = `
    INSERT INTO SCRIPTTYPE (number, author)
    VALUES (?, ?)
`

const courseInsert = `
    INSERT INTO COURSE (courseName, scripttype, orgCount, preptime)
    VALUES (?, ?, ?, ?)
`

const seminarInsert = `
    INSERT INTO SEMINAR (addressID, courseName, instructor, date, time)
    VALUES (?, ?, ?, ?, ?)
`

stmt = db.prepare(personInsert)
stmt.run(111, "Tristan", "Westreicher", 8803882210, null, 1090, "Thurngasse", "Wien", 8);
stmt.run(222, "Aaron", "Santos", 12345, 67894, 1100, "Favoritenstraße", "Wien", 10);

stmt = db.prepare(bankaccountInsert);
stmt.run(123, 123, 123);
stmt.run(123, 54, 12314);

stmt = db.prepare(employeeInsert);
stmt.run(111, 9095370944, 123, 123);
stmt.run(222, 8321164949, 12314, 123);

stmt = db.prepare(instructorInsert);
stmt.run(111, 7824573544, "2024-06-27 13:11:56");
stmt.run(222, 4614140670, "2024-06.27 13:15:46");

stmt = db.prepare(addressInsert);
stmt.run(1, 6542, "Mure", "Pfunds", 511);
stmt.run(2, 6543, "Dorfbahnstraße", "serfaus", 4);
stmt.run(3, 1100, "Favoritenstraße", "Wien", 10);
stmt.run(4, 3023, "Salzstraße", "Salzburg", 40);


stmt = db.prepare(scryptTypeInsert);
stmt.run("script_nmap.pdf", "Tristan Westreicher");
stmt.run("script_nmap2.pdf", "Aaron Santos");

stmt = db.prepare(courseInsert)
stmt.run("SAT", "script_nmap.pdf", 2, 3);
stmt.run("IoT", "script_nmap2.pdf", 4, 5);
stmt.run("Web", "script_nmap2.pdf", 3, 4);
stmt.run("Prog", "script_nmap2.pdf", 4, 2);

stmt = db.prepare(seminarInsert);
stmt.run(1, "SAT", 111, "2024-06-07", "13:20:00");
stmt.run(2, "IoT", 111, "2024-06-07", "17:20:00");
stmt.run(1, "IoT", 222, "2024-06-06", "13:20:00");
stmt.run(4, "Prog", 222, "2024-06-013", "13:20:00");

