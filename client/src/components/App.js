import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import NavBar from "./Navbar";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Dashboard from "../pages/Dashboard";
// Articles page removed — replaced by Groups
import GroupList from "../pages/Groups";
import GroupDetails from "../pages/GroupDetails";

function App() {
  return (
    <BrowserRouter>
      <main className="font-poppins">
        <nav className="top-0 left-0 fixed w-full z-20">
          <NavBar />
        </nav>
        <div style={{ paddingTop: 10}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            {/* Articles route removed */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups" element={<GroupList />} />
            <Route path="/groups/:id" element={<GroupDetails />} />
            <Route path="*" element={<Navigate to="/groups" replace />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
