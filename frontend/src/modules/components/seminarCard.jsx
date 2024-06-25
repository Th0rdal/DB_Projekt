import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const seminarCard = ({ initialFile }) => {
  const [seminars, setSeminars] = useState([]);

  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        const response = await axios.get("api/get_seminars");
        console.log(response);
        setSeminars(response.data || []);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };

    fetchSeminars();
  }, []);
  return (
    <div className="container my-4">
      <div className="row">
        {seminars.map((item, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Seminar: {item.courseName}</h5>
                <p className="card-text">
                  Instructor Name: {item.firstname} {item.lastname}
                </p>
                <p className="card-text">Date: {item.date}</p>
                <p className="card-text">Time: {item.time}</p>
                <p></p>
                <h5 className="card-title">Address:</h5>
                <p className="card-text">
                  Street: {item.street} {item.streetNR}
                </p>
                <p className="card-text">ZIP: {item.ZIP}</p>
                <p className="card-text">City: {item.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default seminarCard;
