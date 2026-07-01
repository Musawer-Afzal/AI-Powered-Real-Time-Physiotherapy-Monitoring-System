import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import "../../styles/auth.css";

export default function Login(){
    const {login}=useAuth();
    const navigate=useNavigate();
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[error,setError]=useState("");

    async function handleSubmit(e){
        e.preventDefault();
        setError("");
        try{
            const user=await login(email,password);
            if(user.role==="patient")
                navigate("/patient/dashboard");
            else if(user.role==="therapist")
                navigate("/therapist/dashboard");
            else if(user.role==="admin")
                navigate("/admin/dashboard");
            else
                navigate("/login");
        }
        catch{
            setError("Invalid email or password");
        }
    }

    return(
        <div className="auth-container">
            <div className="auth-card">
                <div className="logo">
                    🩺
                </div>
                <h1>PhysioAI</h1>
                <p>AI Assisted Physiotherapy</p>
                {error &&
                    <div className="error">
                        {error}
                    </div>
                }
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>
                    <button className="auth-button">Login</button>
                </form>
                <div className="auth-footer">Don't have an account?
                    <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
}