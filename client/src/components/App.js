import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import NavBar from "./Navbar";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Dashboard from "../pages/Dashboard";
import LearnMore from "../pages/LearnMore";
// Articles page removed — replaced by Groups
import GroupList from "../pages/Groups";
import GroupDetails from "../pages/GroupDetails";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <main className="font-poppins">
        <nav className="top-0 left-0 fixed w-full z-20">
          <NavBar />
        </nav>
        <div style={{ padding: 0}}>
          <Toaster />
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            {/* Articles route removed */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learnmore" element={<LearnMore />} />
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
