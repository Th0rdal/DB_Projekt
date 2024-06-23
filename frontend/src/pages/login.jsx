import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [svnr, setSvnr] = useState("");

  const navigate = useNavigate();

  /*useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "True") {
      navigate("/home");
    }
  }, [navigate]);
*/
  const submitButtonClicked = async (e) => {
    e.preventDefault();

    await axios
      .post(
        "api/login",
        {
          svnr,
        },
        {
          withCredentials: true,
        }
      )
      // Handle the response from backend here
      .then((res) => {
        localStorage.setItem("isLoggedIn", "True");
        navigate("/home");
      })

      // Catch errors if any
      .catch((err) => {
        alert("Login error. Please check your username and password");
      });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            height: "60%",
            width: "30%",
            marginTop: "5rem",
            border: "0.5px solid #9370DB",
            backgroundColor: "#F8F8FF",
            padding: "2rem",
            borderRadius: "2rem",
            paddingTop: "50px",
          }}
        >
          <h1>DB Project</h1>
          <h3 style={{ paddingTop: "30px" }}>Login</h3>
          <form style={{ paddingTop: "20px" }}>
            <div className="mb-3">
              <label htmlFor="svnr" className="form-label">
                SVNR
              </label>
              <input
                type="text"
                className="form-control"
                id="svnr"
                aria-describedby="emailHelp"
                required
                value={svnr}
                onChange={(e) => setSvnr(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
              }}
            >
              <button
                type="submit"
                onClick={submitButtonClicked}
                className="btn"
                style={{
                  backgroundColor: "#9370DB",
                  color: "white",
                  width: "40%",
                }}
              >
                Login
              </button>
            </div>
            <div className="mt-3 text-center">
              <p>
                Dont't have an account?{" "}
                <Link to="/register">Register here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
