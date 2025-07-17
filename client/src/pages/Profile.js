
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";  

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    bio: "",
    avatar: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/users/profile/${id}`);
        setForm({
          username: res.data.user.username,
          email: res.data.user.email,
          bio: res.data.user.bio || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('bio', form.bio);
    if (form.avatar) {
      formData.append('avatar', form.avatar);
    }

    try {
      const res = await api.put(`/users/${id}/edit`, formData);
      alert("Profile updated successfully!");
      navigate('/'); // Redirect to home page after update
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: name === "avatar" ? files[0] : value,
    });
  };



    


  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Edit Profile</h2>
      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* ... rest of your form remains the same ... */}
        <div style={{ marginBottom: "15px" }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            disabled
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label>Bio:</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            style={{ width: "100%", padding: "8px", minHeight: "100px" }}
          />
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label>Profile Picture:</label>
          <input 
            type="file" 
            name="avatar" 
            accept="image/*" 
            onChange={handleChange} 
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            padding: "10px 15px", 
            background: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;