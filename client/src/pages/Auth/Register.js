import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Register = () => {

    const [form,setForm] = useState({
        username:"",
        email:"",
        password:"",
       // avatar:null,
    })
    
    const navigate = useNavigate();

    const handleChange=(e)=>{
        const {name,value,files} = e.target;
        setForm({
            ...form,
            [name]: name==="avatar"? files[0] : value,
        })
    }
    
    const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      for (let key in form) {
        if (form[key]) formData.append(key, form[key]);
      }

      try {
        const res = await api.post("/users/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res.data);
        if (res.data.success) {
          const userID = res.data.user.id;
           localStorage.setItem("token", res.data.token); 
          localStorage.setItem("userID", userID);
          alert("Registration successful!");
          navigate(`/profile/${userID}/edit`);

        } else {
          alert("Registration failed: " + res.data.message);
        }
      } catch (err) {
        alert("Error: " + err.response?.data?.message || err.message);
      }
    }

  return (
   <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Register</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      
      <button type="submit" style={buttonStyle}>Register</button>
    </form>
  )
}

export default Register


const formStyle = {
  maxWidth: "400px",
  margin: "auto",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  border: "1px solid #ccc",
  borderRadius: "10px",
  marginTop: "3rem"
};

const inputStyle = {
  padding: "10px",
  fontSize: "16px"
};

const buttonStyle = {
  padding: "10px",
  fontSize: "16px",
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "5px"
};
