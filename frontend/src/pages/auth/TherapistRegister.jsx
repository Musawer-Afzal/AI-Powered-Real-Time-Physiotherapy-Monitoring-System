import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerTherapist } from "../../connect_services/therapistService";

import "../../styles/auth.css";

export default function TherapistRegister() {

    const navigate = useNavigate();

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({
        name: "",
        age: "",
        gender: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone_number: "",
        specialization: "",
        license_number: ""
    });

    async function register(e) {
        e.preventDefault();

        setError("");
        setSuccess("");
        
        try {
            await registerTherapist(form);
            setSuccess(
                "Registration submitted. Awaiting administrator approval."
            );
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        }
        catch (err) {
            console.error(err);
            setError("Registration failed.");
        }
    }
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="logo">
                    🩺
                </div>
                <h1>Therapist Registration</h1>
                <p>
                    Register as a licensed physiotherapist.
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
                        />
                    </div>
                    <div className="form-group">
                        <label>Age</label>
                        <input
                            type="number"
                            value={form.age}
                            onChange={(e)=>setForm({
                                ...form,
                                age:Number(e.target.value)
                            })}
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
                        >
                            <option value="">
                                Select Gender
                            </option>
                            <option value="Male">
                                Male
                            </option>
                            <option value="Female">
                                Female
                            </option>

                            <option value="Other">
                                Other
                            </option>
                        </select>
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
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>

                        <div className="password-wrapper">

                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value
                                    })
                                }
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>

                        </div>
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>

                        <div className="password-wrapper">

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        confirmPassword: e.target.value
                                    })
                                }
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? "🙈" : "👁"}
                            </button>

                        </div>
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            value={form.phone_number}
                            onChange={(e)=>setForm({
                                ...form,
                                phone_number:e.target.value
                            })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Specialization</label>
                        <input
                            value={form.specialization}
                            onChange={(e)=>setForm({
                                ...form,
                                specialization:e.target.value
                            })}
                        />
                    </div>
                    <div className="form-group">
                        <label>License Number</label>
                        <input
                            value={form.license_number}
                            onChange={(e)=>setForm({
                                ...form,
                                license_number:e.target.value
                            })}
                        />
                    </div>
                    <button className="auth-button">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}