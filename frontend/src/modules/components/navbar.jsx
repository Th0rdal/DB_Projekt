import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import {
  CNavbar,
  CContainer,
  CNavbarBrand,
  CCollapse,
  CNavbarToggler,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CForm,
  CFormInput,
  CButton,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const token = Cookies.get("token");

  const logout = async (e) => {
    Cookies.remove("token");
    setUsername("");
    navigate("/");
  };

  useEffect(() => {
    if (!token) {
      setUsername("");
    } else {
      try {
        const tokenWithoutBearer = token.replace("Bearer ", "");
        const decodedToken = jwtDecode(tokenWithoutBearer);
        setUsername(decodedToken.username);
      } catch (error) {
        setUsername("");
      }
    }
  }, [logout]);

  return (
    <>
      <CNavbar expand="lg" colorScheme="light" className="bg-light">
        <CContainer fluid>
          <CNavbarBrand href="/">DBProject</CNavbarBrand>
          <CNavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav className="me-auto">
              <CNavItem className="me-5">
                <CNavLink href="/dashboard" active>
                  Dashboard
                </CNavLink>
              </CNavItem>
              <CNavItem className="me-5">
                <CNavLink href="/create_course" active>
                  Create Course
                </CNavLink>
              </CNavItem>
              <CNavItem className="me-5">
                <CNavLink href="/create_address" active>
                  Create Address
                </CNavLink>
              </CNavItem>

              <CNavItem className="me-5">
                <CNavLink href="/create_seminar" active>
                  Create Seminar
                </CNavLink>
              </CNavItem>
            </CNavbarNav>
            <div className="ms-auto d-flex align-items-center">
              <p className="mb-0 me-5">Username: {username}</p>
              <CButton color="success" variant="outline" onClick={logout}>
                Logout
              </CButton>
            </div>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  );
}

export default Navbar;
