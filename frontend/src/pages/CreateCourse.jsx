import React, { useState } from "react";
import axios from "axios";

const CreateCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [orgcount, setOrgCount] = useState("");
  const [prepTime, setPrepTime] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!courseName || !orgcount || !prepTime) {
      alert("All fields required");
      return;
    }

    try {
      const response = await axios.post("YOUR_API_ENDPOINT", {
        courseName,
        orgcount,
        prepTime,
      });
      console.log(response.data);
      // handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error(error);
      // handle error (e.g., show an error message)
    }
  };

  return (
    <div style={{ height: "95vh" }}>
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        <div
          style={{
            border: "5px solid #9370DB",
            borderRadius: "15px",
            padding: "30px",
            backgroundColor: "#F8F8FF",
            width: "70%",
            margin: "auto",
          }}
        >
          <h2>Create Course</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="courseName" className="form-label">
                Course Name
              </label>
              <input
                type="text"
                className="form-control"
                id="courseName"
                required
                style={{ width: "60%", margin: "0 auto" }}
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="orgcount" className="form-label">
                Organization Count
              </label>
              <input
                type="number"
                className="form-control"
                id="orgcount"
                required
                style={{ width: "60%", margin: "0 auto" }}
                value={orgcount}
                onChange={(e) => setOrgCount(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="prepTime" className="form-label">
                Preparation Time
              </label>
              <input
                type="number"
                className="form-control"
                id="prepTime"
                required
                style={{ width: "60%", margin: "0 auto" }}
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-lg"
              style={{
                backgroundColor: "#9370DB",
                color: "white",
                padding: "10px 20px",
                width: "30%",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
