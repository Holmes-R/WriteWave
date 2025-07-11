import React from 'react'
import { createContext,useContext,useState } from 'react'   


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(()=>{
        JSON.parse(localStorage.getItem("user"))

    })
    const token = localStorage.getItem("token")

    const login=(token,userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    }
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }
    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
