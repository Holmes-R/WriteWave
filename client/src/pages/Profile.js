import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";  
const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    bio: "",
    avatar: null,
  });

  // 🟢 Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/profile/id/${id}`);
        console.log(res.data);
        if (res.data.success) {
          setForm({
            username: res.data.user.username || "",
            bio: res.data.user.bio || "",
            avatar: null,
          });
        }
      } catch (err) {
        alert("Failed to load profile");
      }
    };
    fetchProfile();
  }, [id]);

  // 🔁 Handle form change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: name === "avatar" ? files[0] : value,
    });
  };

  // 🟢 Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

    try {
      const res = await api.put(`/users/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        alert("Profile updated successfully");
        navigate(`/profile/${id}`); // go to profile view page
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Bio"
        />
        <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
