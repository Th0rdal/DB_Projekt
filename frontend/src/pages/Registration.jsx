import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [SVNR, setSvnr] = useState("");
  const [phoneNr1, setPhoneNr1] = useState("");
  const [phoneNr2, setPhoneNr2] = useState("");
  const [street, setStreet] = useState("");
  const [streetNr, setStreetNr] = useState("");
  const [ZIP, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [accountNr, setAccountNr] = useState("");
  const [BLZ, setBlz] = useState("");
  const [accountBalance, setAccountBalance] = useState(""); // Added accountBalance state
  const [blzList, setBlzList] = useState([]); // State to store BLZ list

  useEffect(() => {
    const fetchBLZ = async () => {
      try {
        const dummyData = [
          { BLZ: "10000" },
          { BLZ: "20000" },
          { BLZ: "30000" },
        ];
        setBlzList(dummyData);
        // TODO checken ob enpoint gibt blz weil backend muss uns beim laden der page über get entpoint blz litse liefern und dann automatish über die blz im backend den bankname setzen
        /* const response = await axios.get("api/get_BLZ");
        setBlzList(response.data); */
      } catch (error) {
        console.error("Error fetching BLZ list", error);
      }
    };

    fetchBLZ();
  }, []);

  const registerButtonclicked = (e) => {
    e.preventDefault();
    const registerFormValues = {
      firstName,
      lastName,
      SVNR,
      phoneNr1,
      phoneNr2,
      street,
      streetNr,
      ZIP,
      city,
      accountNr,
      BLZ,
      accountBalance,
    };

    console.log(JSON.stringify(registerFormValues));

    axios
      .post("api/register", registerFormValues, {
        withCredentials: true,
      })
      .then((res) => {
        const { identification } = res.data;
        document.cookie = `identification=${identification}`;
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        alert("Fill in all required fields!");
      });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "210vh",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            height: "60%",
            width: "30%",
            marginTop: "1rem",
            border: "0.5px solid #9370DB",
            backgroundColor: "#F8F8FF",
            padding: "2rem",
            borderRadius: "2rem",
            paddingTop: "30px",
          }}
        >
          <h1>Register</h1>
          <form style={{ paddingTop: "5px" }}>
            <div className="mb-1">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-1">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mb-1">
              <label htmlFor="SVNR" className="form-label">
                SVNR
              </label>
              <input
                type="number"
                maxLength="10"
                className="form-control"
                id="SVNR"
                value={SVNR}
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    setSvnr(e.target.value);
                  }
                }}
                required
              />
            </div>
            <div className="mb-1">
              <label htmlFor="phoneNr1" className="form-label">
                Phone Nr. 1
              </label>
              <input
                type="text"
                className="form-control"
                id="phoneNr1"
                value={phoneNr1}
                onChange={(e) => setPhoneNr1(e.target.value)}
                required
              />
            </div>
            <div className="mb-1">
              <label htmlFor="phoneNr2" className="form-label">
                Phone Nr. 2 (optional)
              </label>
              <input
                type="text"
                className="form-control"
                id="phoneNr2"
                value={phoneNr2}
                onChange={(e) => setPhoneNr2(e.target.value)}
              />
            </div>
            <div className="mb-1">
              <label htmlFor="street" className="form-label">
                Street
              </label>
              <input
                type="text"
                className="form-control"
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>
            <div className="mb-1">
              <label htmlFor="streetNr" className="form-label">
                Street Nr.
              </label>
              <input
                type="text"
                className="form-control"
                id="streetNr"
                value={streetNr}
                onChange={(e) => setStreetNr(e.target.value)}
                required
              />
            </div>
            <div className="mb-1">
              <label htmlFor="ZIP" className="form-label">
                ZIP Code
              </label>
              <input
                type="number"
                maxLength="4"
                className="form-control"
                id="ZIP"
                value={ZIP}
                onChange={(e) => {
                  if (e.target.value.length <= 4) {
                    setZipCode(e.target.value);
                  }
                }}
                required
              />
            </div>
            <div className="mb-1">
              <label htmlFor="city" className="form-label">
                City
              </label>
              <input
                type="text"
                className="form-control"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="mb-1">
              <label htmlFor="accountNr" className="form-label">
                Account Nr. (Bank)
              </label>
              <input
                type="text"
                className="form-control"
                id="accountNr"
                value={accountNr}
                onChange={(e) => setAccountNr(e.target.value)}
                required
              />
            </div>
            <div className="mb-1">
              <label htmlFor="BLZ" className="form-label">
                BLZ
              </label>
              <div className="input-group mb-1">
                <select
                  className="custom-select"
                  id="inputGroupSelect02"
                  value={BLZ}
                  onChange={(e) => setBlz(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose...
                  </option>
                  {blzList.map((blz) => (
                    <option key={blz.BLZ} value={blz.BLZ}>
                      {blz.Bankname} - {blz.BLZ}
                    </option>
                  ))}
                </select>
                <div className="input-group-append"></div>
              </div>
            </div>
            <div className="mb-1">
              <label htmlFor="accountBalance" className="form-label">
                Account Balance (€)
              </label>
              <input
                type="number"
                className="form-control"
                id="accountBalance"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                required
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <button
                type="submit"
                onClick={registerButtonclicked}
                className="btn"
                style={{
                  backgroundColor: "#9370DB",
                  color: "white",
                  width: "40%",
                }}
              >
                Register
              </button>
            </div>
            <div className="mt-3 text-center">
              <p>
                Already have an account? <Link to="/">Login here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registration;
