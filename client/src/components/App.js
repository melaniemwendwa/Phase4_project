// import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "../pages/Home"
import NavBar from "./Navbar";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Articles from "../pages/Articles";
import SignIn from "../pages/SignIn";

function App() {
  return (
    <BrowserRouter>
      <main className="font-poppins">
        <nav className="top-0 left-0 fixed w-full z-20">
          <NavBar />
        </nav>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signup" component={SignUp} />
          <Route path="/signin" component={SignIn} />
          <Route path="/articles" component={Articles} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </main>
    </BrowserRouter>
  )
}

export default App;
