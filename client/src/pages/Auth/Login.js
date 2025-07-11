import React from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = ({use}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/users/login", { email, password });
            if(res.data.success){
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setUser(res.data.user);
                seToken(res.data.token);
                navigate(`/profile/${res.data.user.id}` );
            }else{
                alert("Login failed. Please check your credentials.");  
            }
        } catch (error) {
            alert("Error: " + err.response?.data?.message || err.message);  
        }
    }
  return (
   <form onSubmit={handleLogin} style={formStyle}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle}>Login</button>
    </form>
  )
}

export default Login


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
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px"
};