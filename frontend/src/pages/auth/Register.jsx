import {useState} from "react";

import {Link,useNavigate} from "react-router-dom";

import authService from "../../connect_services/authService";

import "../../styles/auth.css";

export default function Register(){

    const navigate=useNavigate();

    const[success,setSuccess]=useState("");

    const[error,setError]=useState("");

    const[form,setForm]=useState({

        name:"",

        email:"",

        password:""

    });

    async function register(e){

        e.preventDefault();

        setSuccess("");

        setError("");

        try{

            await authService.register(form);

            setSuccess("Account created successfully.");

            setTimeout(()=>{

                navigate("/login");

            },1000);

        }

        catch{

            setError("Registration failed.");

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

                            onChange={(e)=>setForm({

                                ...form,

                                name:e.target.value

                            })}

                        />

                    </div>

                    <div className="form-group">

                        <label>Email</label>

                        <input

                            type="email"

                            onChange={(e)=>setForm({

                                ...form,

                                email:e.target.value

                            })}

                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input

                            type="password"

                            onChange={(e)=>setForm({

                                ...form,

                                password:e.target.value

                            })}

                        />

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