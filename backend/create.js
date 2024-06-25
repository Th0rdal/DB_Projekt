//NOCH OHNE SKRIPT PDF!!!

const express = require("express");
const router = express.Router();
const DBAbstraction = require("../database/db");
const multer = require("multer");
const path = require("path");
const uuid = require("uuid");
const fs = require("fs").promises;

const { checkIdentification } = require("./session");
const { json } = require("body-parser");

// TODO uplaod directory for pdf files
// Set up multer for file upload handling
const upload = multer({ dest: "uploads/" }); // Specify your upload directory

// ++++++++++++++++++++++++++++ CREATE COURSES + SCRIPTTYPE +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const checkCourseName = async (courseName) => {
  try {
    const query = "SELECT CourseName FROM Course WHERE CourseName = ?";
    const row = await DBAbstraction.get(query, courseName);
    return row;
  } catch (err) {
    throw err;
  }
};

const insertCourse = async (courseName, pdfName, orgCount, prepTime) => {
  const exists = await checkCourseName(courseName);
  if (exists) {
    throw new Error("Course name already exists");
  }

  try {
    const query = `INSERT INTO Course (CourseName, scriptType, OrgCount, PrepTime) VALUES (?, ?, ?, ?)`;
    const row = DBAbstraction.run(query, [
      courseName,
      pdfName,
      orgCount,
      prepTime,
    ]);
    return row;
  } catch (err) {
    throw err;
  }
};

const insertScriptType = async (pdf, author) => {
  try {
    const query = `INSERT INTO ScriptType (number, author) VALUES (?, ?)`;
    const row = DBAbstraction.run(query, [pdf, author]);
    return row;
  } catch (err) {
    throw err;
  }
};

const getSVNRbyIdentification = async (identification) => {
  try {
    const query = `SELECT SVNR FROM Instructor WHERE Identification = ?`;
    const row = await DBAbstraction.get(query, [identification]);
    return row;
  } catch (err) {
    throw err;
  }
};

const getNameBySVNR = async (SVNR) => {
  try {
    const query = `SELECT firstname, lastname FROM Person WHERE SVNR = ?`;
    const row = await DBAbstraction.get(query, [SVNR]);
    return row;
  } catch (err) {
    throw err;
  }
};

router.post("/create_course", upload.single("pdfFile"), async (req, res) => {
  const { courseName, orgCount, prepTime } = req.body;
  const identification = req.cookies.identification;
  const pdfFile = req.file;

  console.log(identification);

  if (!pdfFile) {
    return res.status(400).send("No PDF file uploaded.");
  }

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
        error: "Identification does not exist in the Instructor table",
      });
    }

    const newFileName = uuid.v4() + ".pdf";
    const newPath = path.join(__dirname, "..", "uploads", newFileName);
    await fs.rename(pdfFile.path, newPath);

    const svnrRow = await getSVNRbyIdentification(identification);
    if (!svnrRow) {
      return res.status(404).send("Instructor not found.");
    }

    const { SVNR } = svnrRow;
    console.log(SVNR);
    const nameRow = await getNameBySVNR(SVNR);
    if (!nameRow) {
      return res.status(404).send("Name not found.");
    }

    const author = `${nameRow.firstname} ${nameRow.lastname}`;
    const pdfName = newFileName;

    await insertScriptType(pdfName, author);
    await insertCourse(courseName, pdfName, orgCount, prepTime);

    res.status(200).json({ message: "Created course successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ++++++++++++++++++++++++++++ CREATE ADDRESSES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const insertAddress = async (city, ZIP, street, streetNr) => {
  try {
    const query = `INSERT INTO address (City, ZIP, Street, StreetNR) VALUES (?, ?, ?, ?)`;
    const row = await DBAbstraction.run(query, [city, ZIP, street, streetNr]);
    return row;
  } catch (err) {
    throw err;
  }
};
router.post("/create_address", async (req, res) => {
  const { city, ZIP, street, streetNr } = req.body;
  const identification = req.cookies.identification;

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
    console.log("juhu");
  } catch (err) {
    console.log("test");
    res.status(500).json({ error: err.message });
  }
});

// ++++++++++++++++++++++++++++ GET COURSES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const getAllCourses = async () => {
  try {
    const query = "SELECT courseName, orgCount, prepTime FROM Course";
    const rows = await DBAbstraction.all(query, []);
    return rows;
  } catch (err) {
    throw err;
  }
};

router.get("/get_courses", async (req, res) => {
  const identification = req.cookies.identification;
  if (!identification) {
    return res.status(400).json({ error: "Identification cookie is missing" });
  }

  try {
    const identificationRow = await checkIdentification(identification);
    if (!identificationRow) {
      return res.status(400).json({
        error: "identification does not exist in the Instructor table",
      });
    }
    const courseList = await getAllCourses();
    res.status(200).json(courseList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ++++++++++++++++++++++++++++ GET ADDRESSES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const getAllAddresses = async () => {
  try {
    const query = "SELECT * FROM Address";
    const rows = await DBAbstraction.all(query, []);
    return rows;
  } catch (err) {
    throw err;
  }
};

router.get("/get_addresses", async (req, res) => {
  const identification = req.cookies.identification;
  if (!identification) {
    return res.status(400).json({ error: "Identification cookie is missing" });
  }

  try {
    const identificationRow = await checkIdentification(identification);
    if (!identificationRow) {
      return res.status(400).json({
        error: "identification does not exist in the Instructor table",
      });
    }

    const addressList = await getAllAddresses();
    res.status(200).json(addressList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ++++++++++++++++++++++++++++ CREATE SEMINAR +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const insertSeminar = async (addressID, courseName, instructor, date, time) => {
  try {
    const query = `INSERT INTO Seminar (AddressID, courseName, instructor, date, time) VALUES (?, ?, ?, ?, ?)`;
    const row = await DBAbstraction.run(query, [
      addressID,
      courseName,
      instructor,
      date,
      time,
    ]);
    return row;
  } catch (err) {
    throw err;
  }
};

router.post("/create_seminar", async (req, res) => {
  const { addressID, date, time, courseName } = req.body;
  const identification = req.cookies.identification;

  console.log(JSON.stringify(req.body));

  if (!identification) {
    return res.status(400).json({ error: "Identification cookie is missing" });
  }
  if (!addressID || !date || !time || !courseName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const identificationRow = await checkIdentification(identification);
    if (!identificationRow) {
      return res.status(400).json({
        error: "Identification does not exist in the Instructor table",
      });
    }

    // Überprüfen, ob der Kurs existiert
    const courseExists = await checkCourseName(courseName);
    if (!courseExists) {
      return res.status(400).json({ error: "Course does not exist" });
    }

    const formattedDate = new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedTime = new Date(`1970-01-01T${time}Z`)
      .toISOString()
      .split("T")[1]
      .split(".")[0]; // HH:MM:SS

    await insertSeminar(
      addressID,
      courseName,
      identification,
      formattedDate,
      formattedTime
    );

    res.status(200).json({ message: "created seminar successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
