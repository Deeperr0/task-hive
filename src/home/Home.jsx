import React from "react";
import Project from "./Project";
import "./Home.css";

export default function Home({ user, role }) {
  return (
    <div className="home--container">
      <Project user={user} role={role} />
    </div>
  );
}
