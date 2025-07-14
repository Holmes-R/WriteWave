import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { useState } from "react";

function App() {
  const [user,setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const [token,setToken] = useState(localStorage.getItem("token"))

  const logout = () => {
    localStorage.clear()
    setUser(null);
    setToken(null);
  }
  return (
    <BrowserRouter >
    <Navbar user={user} logout={logout} />
    <Routes>
      <Route path='/login' element={<Login setUser={setUser} setToken={setToken}  />}/> 
       <Route path="/register" element={<Register />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
