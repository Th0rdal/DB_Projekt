//NOCH OHNE SKRIPT PDF!!!

const express = require("express");
const router = express.Router();
const db = require("../database/db");
const multer = require("multer");

const { checkIdentification } = require("./session");
const { json } = require("body-parser");
//const { generateUniqueScriptNr } = require('./utils');

// TODO uplaod directory for pdf files
// Set up multer for file upload handling
const upload = multer({ dest: "uploads/" }); // Specify your upload directory

// ++++++++++++++++++++++++++++ CREATE COURSES + SCRIPTTYPE +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const checkCourseName = (courseName) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT CourseName FROM Course WHERE CourseName = ?";
    db.get(query, [courseName], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(!!row); // Wenn eine Zeile gefunden wurde, existiert der Kursname bereits
      }
    });
  });
};

const insertCourse = async (courseName, orgCount, prepTime) => {
  const exists = await checkCourseName(courseName);
  if (exists) {
    throw new Error("Course name already exists");
  }

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Course (CourseName, OrgCount, PrepTime) VALUES (?, ?, ?)`;
    db.run(query, [courseName, orgCount, prepTime], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const insertScriptType = async (author, pdf) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO ScriptType (Author, PDF) VALUES (?, ?)`;
    db.run(query, [author, pdf], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const getSVNRbyIdentification = async (identification) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT SVNR FROM Instructor WHERE Identification = ?`;
    db.get(query, [identification], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const getNameBySVNR = async (SVNR) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT FirstName, LastName FROM Person WHERE SVNR = ?`;
    db.get(query, [SVNR], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// TODO logik noch einbauane mit pdf für datnebank weil grad pdf in ulpoad mit uuid gespiehcert
router.post("/create_course", upload.single("pdfFile"), async (req, res) => {
  const { courseName, orgCount, prepTime } = req.body;
  const identification = req.cookies.identification;
  const pdfFile = req.file;

  console.log(JSON.stringify(req.body)); // Logs the other form fields
  console.log(pdfFile); // Logs the file details

  if (!identification) {
    return res.status(400).json({ error: "Identification cookie is missing" });
  }
  if (!courseName || !orgCount || !prepTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const identificationRow = await checkIdentification(identification);
    if (!identificationRow) {
      return res.status(400).json({
        error: "identification does not exist in the Instructor table",
      });
    }

    const SVNR = await getSVNRbyIdentification(identification);
    const result = await getNameBySVNR(SVNR);
    const author = `${result.FirstName} ${result.LastName}`;
    const pdf = 0; //DUMMY

    // Hier kannst du den Dateiinhalt speichern oder weiter verarbeiten
    // Beispiel:
    // const filePath = `uploads/${pdfFile.filename}`;
    // fs.renameSync(pdfFile.path, filePath);

    await insertCourse(courseName, orgCount, prepTime);
    await insertScriptType(author, pdf);

    res.status(200).json({ message: "created course successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ++++++++++++++++++++++++++++ CREATE ADDRESSES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const insertAddress = async (city, ZIP, street, streetNr) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Address (City, ZIP, Street, StreetNR) VALUES (?, ?, ?, ?)`;
    db.run(query, [city, ZIP, street, streetNr], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
router.post("/create_address", async (req, res) => {
  const { city, ZIP, street, streetNr } = req.body;
  const identification = req.cookies.identification;

  console.log(JSON.stringify(req.body));
  if (!identification) {
    return res.status(400).json({ error: "Identification cookie is missing" });
  }
  if (!city || !ZIP || !street || !streetNr) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const identificationRow = await checkIdentification(identification);
    if (!identificationRow) {
      return res.status(400).json({
        error: "identification does not exist in the Instructor table",
      });
    }

    await insertAddress(city, ZIP, street, streetNr);

    res.status(200).json({ message: "created address successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ++++++++++++++++++++++++++++ GET COURSES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const getAllCourses = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT CourseName FROM Course";
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

router.get("/get_courses", async (req, res) => {
  try {
    const courseList = await getAllCourses();
    res.status(200).json(courseList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ++++++++++++++++++++++++++++ GET ADDRESSES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const getAllAddresses = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM Address";
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

router.get("/get_addresses", async (req, res) => {
  try {
    const addressList = await getAllAddresses();
    res.status(200).json(addressList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ++++++++++++++++++++++++++++ CREATE SEMINAR +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const insertSeminar = async (addressID, date, time, course) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO Seminar (AddressID, Date, Time, Course) VALUES (?, ?, ?, ?)`;
    db.run(query, [addressID, date, time, course], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
router.post("/create_seminar", async (req, res) => {
  const { addressID, date, time, course } = req.body;
  const identification = req.cookies.identification;

  console.log(JSON.stringify(req.body));
  
  if (!identification) {
    return res.status(400).json({ error: "Identification cookie is missing" });
  }
  if (!addressID || !date || !time || !course) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const identificationRow = await checkIdentification(identification);
    if (!identificationRow) {
      return res.status(400).json({
        error: "identification does not exist in the Instructor table",
      });
    }

    await insertSeminar(addressID, date, time, course);

    res.status(200).json({ message: "created seminar successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
