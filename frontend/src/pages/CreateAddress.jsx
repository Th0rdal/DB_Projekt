import React, { useState } from "react";
import axios from "axios";

const CreateAddress = () => {
  const [city, setCity] = useState("");
  const [ZIP, setZIP] = useState("");
  const [street, setStreet] = useState("");
  const [streetNr, setStreetNr] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const addressFormValues = {
      city,
      ZIP,
      street,
      streetNr,
    };

    console.log(JSON.stringify(addressFormValues));

    if (!city || !ZIP || !street || !streetNr) {
      alert("All fields required");
      return;
    }

    await axios
      .post(
        "api/create_address",

        addressFormValues,

        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status == 200) {
          alert("Address sucessfully created!");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("test error creat!");
      });
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
                type="number"
                maxLength="4"
                className="form-control"
                id="zipCode"
                style={{ width: "60%", margin: "0 auto" }}
                value={ZIP}
                onChange={(e) => {
                  if (e.target.value.length <= 4) {
                    setZIP(e.target.value);
                  }
                }}
                required
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

export default CreateAddress;
