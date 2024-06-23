import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
// import Navbar from "./modules/components/Navbar.jsx";
import Navbar from "./modules/components/navbar.jsx"
import { isAuthenticated } from "./auth";
import Login from "./pages/login.jsx";
import Registration from "./pages/Registration.jsx";
import CreateCourse from "./pages/CreateCourse.jsx";
import CreateAddress from "./pages/CreateAddress.jsx";
import CreateSeminar from "./pages/CreateSeminar.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? <Login /> : <Navigate to="/register" />
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={isAuthenticated() ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={isAuthenticated() ? <Registration /> : <Navigate to="/" />}
        />
        <Route
          path="/create_course"
          element={isAuthenticated() ? <CreateCourse /> : <Navigate to="/" />}
        />
        <Route
          path="/create_address"
          element={isAuthenticated() ? <CreateAddress /> : <Navigate to="/" />}
        />
        <Route
          path="/create_seminar"
          element={isAuthenticated() ? <CreateSeminar /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
