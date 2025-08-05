import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserA from "./pages/UserA";
import UserB from "./pages/UserB";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/user-a" element={<UserA />} />
        <Route path="/user-b" element={<UserB />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
