import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateSeminar = () => {
  const [addresses, setAddresses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("api/get_addresses");
        setAddresses(response.data || []);
        if (response.data.length === 0) {
          alert("No addresses found. Please create one first.");
        }
      } catch (error) {
        console.error("Error fetching addresses", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get("api/get_courses");
        setCourses(response.data || []);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };

    fetchAddresses();
    fetchCourses();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedAddress || !selectedCourse || !date || !time) {
      alert("All fields required");
      return;
    }

    try {
      const formattedDate = formatDate(date);
      const sessionId = localStorage.getItem("sessionId");
      const svnrResponse = await axios.get(`api/get_svnr?sessionId=${sessionId}`);
      const svnr = svnrResponse.data.svnr;

      const response = await axios.post("api/create_seminar", {
        address: selectedAddress,
        courseName: selectedCourse,
        date: formattedDate,
        time,
        svnr,
      });
      console.log(response.data);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error(error);
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
          <h2>Create Seminar</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <select
                className="form-control"
                id="address"
                required
                style={{ width: "60%", margin: "0 auto" }}
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                <option value="">Select Address</option>
                {Array.isArray(addresses) &&
                  addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="courseName" className="form-label">
                Course Name
              </label>
              <select
                className="form-control"
                id="courseName"
                required
                style={{ width: "60%", margin: "0 auto" }}
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select Course</option>
                {Array.isArray(courses) &&
                  courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                required
                style={{ width: "60%", margin: "0 auto" }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="time" className="form-label">
                Time
              </label>
              <input
                type="time"
                className="form-control"
                id="time"
                required
                style={{ width: "60%", margin: "0 auto" }}
                value={time}
                onChange={(e) => setTime(e.target.value)}
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

export default CreateSeminar;
