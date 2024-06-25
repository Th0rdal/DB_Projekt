import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddressCard = ({ initialFile }) => {
  const [addresses, setAddresses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("api/get_addresses");
        console.log(response);
        setAddresses(response.data || []);

        
      } catch (error) {
        console.error("Error fetching addresses", error);
      }
    };

    fetchAddresses();
  }, []);
  return (
    <div className="container my-4">
      <div className="row">
        {addresses.map((item, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Addresse:</h5>
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

export default AddressCard;
