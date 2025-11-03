import { useState } from "react";
import "./App.css";
import Home from "./home/Home";
import Blogs from "./blogs/Blogs";
import Signup from "./Components/Signup";
import Profile from "./profile/Profile";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthProvider";
import { Toaster } from "react-hot-toast";

function App() {
  const [authUser, setAuthUser] = useAuth();

  function giveAlert() {
    alert("You need to login first");
  }

  return (
    <>
      {/* ✅ Add Toaster globally so toast messages from anywhere will show */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/blogs"
          element={authUser ? <Blogs /> : <Navigate to="/signup" />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/myprofile"
          element={authUser ? <Profile /> : <Navigate to="/signup" />}
        />
      </Routes>
    </>
  );
}

export default App;
