import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GroupList from "./GroupList";
import GroupDetails from "./GroupDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/groups" element={<GroupList />} />
        <Route path="/groups/:id" element={<GroupDetails />} />
        <Route path="*" element={<Navigate to="/groups" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
