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
        console.log(response);
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
        console.log(response);
        setCourses(response.data || []);

        if (response.data.length === 0) {
          alert("No courses found. Please create one first.");
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };

    fetchAddresses();
    fetchCourses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedAddress || !selectedCourse || !date || !time) {
      alert("All fields required");
      return;
    }
    console.log(date);
    console.log(time);
    try {
      await axios
        .post(
          "api/create_seminar",
          {
            addressID: selectedAddress,
            courseName: selectedCourse,
            date,
            time,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.status == 200) {
            alert("Form submitted successfully!");
          }
          console.log(res.data);
        })
        .catch((error) => {
          console.log("test");
          console.log(error);
          alert("Create Seminar went wrong! - check input");
        });
    } catch (error) {
      console.log("catch 2");
      alert("login first");
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
                  addresses.map((address, index) => (
                    <option key={index} value={address.addressID}>
                      {address.street} {address.streetNR}, {address.ZIP}{" "}
                      {address.city}
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
                  courses.map((course, index) => (
                    <option key={index} value={course.courseName}>
                      {course.courseName}
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
