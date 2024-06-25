import React from "react";
import CourseCard from "../modules/components/courseCard";
import AddressCard from "../modules/components/addressCard";

const Dashboard = () => {
  return (
    <div className="row">
      <h1>Created Courses </h1>
      <CourseCard />
      <h1>Adresses </h1>
      <AddressCard />
    </div>
  );
};

export default Dashboard;
