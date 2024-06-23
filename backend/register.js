const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { generateUniqueIdentification } = require("./utils");

const getAllBLZ = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT BLZ FROM BankName";
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const checkBLZ = (BLZ) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT BankName FROM BankName WHERE BLZ = ?";
    db.get(query, [BLZ], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const insertPerson = (
  SVNR,
  firstName,
  lastName,
  phoneNr1,
  phoneNr2,
  ZIP,
  street,
  city,
  streetNr
) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Person (SVNR, FirstName, LastName, PhoneNr1, PhoneNr2, ZIP, Street, City, StreetNr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(
      query,
      [
        SVNR,
        firstName,
        lastName,
        phoneNr1,
        phoneNr2 || null,
        ZIP,
        street,
        city,
        streetNr,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

insertPerson(2, "asdf", "asd", 202, 23424, 32, "asdf", "wei", "asdf");

const insertEmployee = (SVNR, accountBalance, accountNr, BLZ) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Employee (SVNR, AccountBalance, AccountNr, BLZ) VALUES (?, ?, ?, ?)`;
    db.run(query, [SVNR, accountBalance, accountNr, BLZ], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const insertInstructor = (identification, currentDate, SVNR) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Instructor (Identification, HiringDate, SVNR) VALUES (?, ?, ?)`;
    db.run(query, [identification, currentDate, SVNR], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

router.get("/get_BLZ", async (req, res) => {
  try {
    const blzList = await getAllBLZ();
    res.status(200).json(blzList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/register", async (req, res) => {
  const {
    SVNR,
    firstName,
    lastName,
    phoneNr1,
    phoneNr2,
    ZIP,
    street,
    city,
    streetNr,
    accountBalance,
    accountNr,
    BLZ,
  } = req.body;
  console.log(JSON.stringify(req.body));
  if (
    !SVNR ||
    !firstName ||
    !lastName ||
    !phoneNr1 ||
    !ZIP ||
    !street ||
    !city ||
    !streetNr ||
    !accountBalance ||
    !accountNr ||
    !BLZ
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const BLZRow = await checkBLZ(BLZ);
    if (!BLZRow) {
      return res
        .status(400)
        .json({ error: "BLZ does not exist in the BankName table" });
    }

    const identification = await generateUniqueIdentification();
    const currentDate = new Date();

    await insertPerson(
      SVNR,
      firstName,
      lastName,
      phoneNr1,
      phoneNr2,
      ZIP,
      street,
      city,
      streetNr
    );
    await insertEmployee(SVNR, accountBalance, accountNr, BLZ);
    await insertInstructor(identification, currentDate, SVNR);

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
