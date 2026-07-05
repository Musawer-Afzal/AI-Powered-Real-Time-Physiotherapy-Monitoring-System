import {useState} from "react";
import { Eye, EyeOff } from "lucide-react";

import {Link,useNavigate} from "react-router-dom";

import authService from "../../connect_services/authService";
import patientService from "../../connect_services/patientService";

import "../../styles/auth.css";

export default function Register(){
    const navigate=useNavigate();
    const[success,setSuccess]=useState("");
    const[error,setError]=useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        date_of_birth: "",
        gender: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function register(e) {
        e.preventDefault();

        setSuccess("");
        setError("");
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (
            !form.name ||
            !form.email ||
            !form.password ||
            !form.confirmPassword ||
            !form.date_of_birth ||
            !form.gender
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (form.name.trim().length < 3) {
            setError("Name must be at least 3 characters long.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (!/[A-Z]/.test(form.password)) {
            setError("Password must contain at least one uppercase letter.");
            return;
        }

        if (!/[a-z]/.test(form.password)) {
            setError("Password must contain at least one lowercase letter.");
            return;
        }

        if (!/[0-9]/.test(form.password)) {
            setError("Password must contain at least one number.");
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
            setError("Password must contain at least one special character.");
            return;
        }
        try {
            // Create User
            await authService.register({
                name: form.name,
                email: form.email,
                password: form.password
            });

            // Login immediately to obtain JWT
            await authService.login(
                form.email,
                form.password
            );

            // Create Patient Profile
            await patientService.createPatientProfile({
                date_of_birth: form.date_of_birth,
                gender: form.gender,
                diagnosis: "",
                therapist_notes: ""
            });
            authService.logout();
            setSuccess("Account created successfully.");
            setTimeout(() => {
                navigate("/login");
            }, 1000);
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
                setError("Registration failed.");
            }
        }
    }

    return(
        <div className="auth-container">
            <div className="auth-card">
                <div className="logo">
                    🩺
                </div>
                <h1>
                    Register
                </h1>
                <p>
                    Create your PhysioAI account
                </p>
                {success &&
                    <div className="success">
                        {success}
                    </div>
                }
                {error &&
                    <div className="error">
                        {error}
                    </div>
                }
                <form onSubmit={register}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            value={form.name}
                            onChange={(e)=>setForm({
                                ...form,
                                name:e.target.value
                            })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e)=>setForm({
                                ...form,
                                email:e.target.value
                            })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e)=>setForm({
                                    ...form,
                                    password:e.target.value
                                })}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="password-input">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={(e)=>setForm({
                                    ...form,
                                    confirmPassword:e.target.value
                                })}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            value={form.date_of_birth}
                            onChange={(e)=>setForm({
                                ...form,
                                date_of_birth:e.target.value
                            })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            value={form.gender}
                            onChange={(e)=>setForm({
                                ...form,
                                gender:e.target.value
                            })}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button className="auth-button">
                        Register
                    </button>
                </form>
                <div className="auth-footer">
                    Already have an account?
                    <Link to="/login">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}