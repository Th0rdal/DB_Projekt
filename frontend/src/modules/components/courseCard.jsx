import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const courseCard = ({ initialFile }) => {
  const [addresses, setAddresses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("api/get_courses");
        console.log(response);
        setCourses(response.data || []);

       
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };

    fetchCourses();
  }, []);
  return (
    <div className="container my-4">
      <div className="row">
        {courses.map((item, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Coursename: {item.courseName}</h5>
                <p className="card-text">
                  Number of Organizers: {item.orgCount}
                </p>
                <p className="card-text">
                  Perperation Time (hours): {item.prepTime}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default courseCard;
