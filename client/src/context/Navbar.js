import React from 'react'
import { Link,useNavigate } from 'react-router-dom'


const Navbar = ({user,logout}) => {

  const navigate = useNavigate();

  const handleLogout = ()=>{
    logout()
    navigate('/login')
  }

  return (

  <nav style={navStyle}>
    <Link to="/" style={brandStyle}>WriteWave</Link>
    <div style={navLinks}>
      {!user?(
        <>
          <Link to="/login" style={linkStyle}>Login</Link>
          <Link to="/register" style={linkStyle}>Register</Link>
        </>
      ) :(
        <>
          <Link to={`/profile/${user.id}`} style={linkStyle}>Profile</Link>
          <Link to={`/profile/${user.id}/edit`} style={linkStyle}>Edit Profile</Link>
          <Link to="/blogs/create" style={linkStyle}>Create Blogs</Link>
          <Link to="/chat" style={linkStyle}>Chat</Link>
          <button onClick={handleLogout} style={logoutStyle}>Logout</button>
        
        </>
      )

    }

    </div>
    </nav>
  )
}

export default Navbar




// CSS STyling 
const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#333",
  color: "white"
};

const brandStyle = {
  fontWeight: "bold",
  fontSize: "20px",
  color: "white",
  textDecoration: "none"
};

const navLinks = {
  display: "flex",
  gap: "15px",
  alignItems: "center"
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px"
};

const logoutStyle = {
  backgroundColor: "#ff4d4d",
  border: "none",
  color: "white",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer"
};