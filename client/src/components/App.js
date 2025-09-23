import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GroupList from "./GroupList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/groups" element={<GroupList />} />
        <Route path="*" element={<Navigate to="/groups" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
