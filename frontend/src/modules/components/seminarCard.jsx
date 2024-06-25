import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const seminarCard = ({ initialFile }) => {
  const [seminars, setSeminars] = useState([]);

  const dummySeminars = [
    {
      courseName: "Sat",
      firstName: "Tristan",
      lastName: "Smith",
      date: "2024-06-24",
      time: "12:00",
      street: "thurngasse",
      streetNR: "8",
      ZIP: "1090",
      city: "Wien",
    },
    {
      courseName: "React Workshop",
      firstName: "Emma",
      lastName: "Johnson",
      date: "2024-07-10",
      time: "15:30",
      street: "Main Street",
      streetNR: "123",
      ZIP: "45678",
      city: "Anytown",
    },
    {
      courseName: "Python Basics",
      firstName: "Max",
      lastName: "Williams",
      date: "2024-07-15",
      time: "10:00",
      street: "Hauptstraße",
      streetNR: "5",
      ZIP: "12345",
      city: "Musterstadt",
    },
    {
      courseName: "Web Design",
      firstName: "Sophie",
      lastName: "Brown",
      date: "2024-08-02",
      time: "09:00",
      street: "Baker Street",
      streetNR: "221B",
      ZIP: "54321",
      city: "London",
    },
    {
      courseName: "Data Science Bootcamp",
      firstName: "Liam",
      lastName: "Davis",
      date: "2024-08-20",
      time: "13:45",
      street: "Data Street",
      streetNR: "42",
      ZIP: "67890",
      city: "Metropolis",
    },
    {
      courseName: "JavaScript Advanced",
      firstName: "Ava",
      lastName: "Miller",
      date: "2024-09-05",
      time: "14:15",
      street: "Oak Avenue",
      streetNR: "7",
      ZIP: "54321",
      city: "Springfield",
    },
    {
      courseName: "AI and Ethics",
      firstName: "Noah",
      lastName: "Garcia",
      date: "2024-09-15",
      time: "11:30",
      street: "Technology Boulevard",
      streetNR: "99",
      ZIP: "98765",
      city: "Future City",
    },
  ];

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
        {dummySeminars.map((item, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Seminar: {item.courseName}</h5>
                <p className="card-text">
                  Instructor Name: {item.firstName} {item.lastName}
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
