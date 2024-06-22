import React, { useState } from "react";
import axios from "axios";

const CreateAddresses = () => {
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [streetNr, setStreetNr] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!city || !zipCode || !street || !streetNr) {
      alert("All fields required");
      return;
    }

    try {
      const response = await axios.post("YOUR_API_ENDPOINT", {
        city,
        zipCode,
        street,
        streetNr,
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
          <h2>Create Address</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="city" className="form-label">
                City
              </label>
              <input
                type="text"
                className="form-control"
                id="city"
                required
                style={{ width: "60%", margin: "0 auto" }}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="zipCode" className="form-label">
                Zip Code
              </label>
              <input
                type="text"
                className="form-control"
                id="zipCode"
                required
                style={{ width: "60%", margin: "0 auto" }}
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="street" className="form-label">
                Street
              </label>
              <input
                type="text"
                className="form-control"
                id="street"
                required
                style={{ width: "60%", margin: "0 auto" }}
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="streetNr" className="form-label">
                Street Number
              </label>
              <input
                type="text"
                className="form-control"
                id="streetNr"
                required
                style={{ width: "60%", margin: "0 auto" }}
                value={streetNr}
                onChange={(e) => setStreetNr(e.target.value)}
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

export default CreateAddresses;
