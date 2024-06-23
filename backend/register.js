const express = require("express");
const router = express.Router();
const { generateUniqueIdentification } = require("./utils");
const DBAbstraction = require('../database/db');

const getAllBLZ = async () => {
  try {
    const query = "SELECT BLZ FROM bankname";
    const rows = await DBAbstraction.all(query, []);
    return rows;
  } catch (err) {
    throw err;
  }
};

const checkBLZ = async (BLZ) => {
  const query = "SELECT BankName FROM BankName WHERE BLZ = ?";
  try {
    const row = await DBAbstraction.get(query, [BLZ]);
    if (row) {
      return row;
    } else {
      throw new Error("No data found");
    }
  } catch (err) {
    throw err;
  }
};

const insertPerson = async (
    SVNR, firstName, lastName, phoneNr1, phoneNr2, ZIP, street, city, streetNr
) => {
  const query = `INSERT INTO person (SVNR, firstname, lastname, phoneNR1, phoneNR2, ZIP, Street, City, StreetNR) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    await DBAbstraction.run(query, [
      SVNR, firstName, lastName, phoneNr1, phoneNr2 || null, ZIP, street, city, streetNr,
    ]);
  } catch (err) {
    throw err;
  }
};

// insertPerson(2, "asdf", "asd", 202, 23424, 32, "asdf", "wei", "asdf");

const insertEmployee = async (SVNR, employeeNr, accountNr, BLZ) => {
  const query = `INSERT INTO employee (SVNR, employeeNr) VALUES (?, ?, ?, ?)`;
  try {
    await DBAbstraction.run(query, [SVNR, accountBalance, accountNr, BLZ]);
  } catch (err) {
    throw err;
  }
};

const insertInstructor = async (SVNR, identification, currentDate) => {
  const query = `INSERT INTO Instructor (SVNR, Identification, HiringDate) VALUES (?, ?, ?)`;
  try {
    await DBAbstraction.run(query, [SVNR, identification, currentDate]);
  } catch (err) {
    throw err;
  }
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
    SVNR, firstName, lastName, phoneNr1, phoneNr2, ZIP, street, city, streetNr, accountBalance, accountNr, BLZ,
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

    res.cookie("identification", identification);
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
