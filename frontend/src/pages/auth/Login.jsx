import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import "../../styles/auth.css";

export default function Login(){
    const {login}=useAuth();
    const navigate=useNavigate();
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [showPassword, setShowPassword] = useState(false);
    const[error,setError]=useState("");

    async function handleSubmit(e){
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
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
        catch (err) {
            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setError(detail[0].msg);
            }
            else if (typeof detail === "string") {
                setError(detail);
            }
            else {
                setError("Invalid email or password.");
            }
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
                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword
                                    ? <EyeOff size={20}/>
                                    : <Eye size={20}/>
                                }
                            </button>
                        </div>
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