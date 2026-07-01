import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import therapistService from "../../connect_services/therapistService";
import { useAuth } from "../../contexts/AuthContext";

import "./Dashboard.css";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPatients() {
            try {
                const data =
                    await therapistService.getMyPatients();
                setPatients(data);
            }
            catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        loadPatients();
    }, []);

    return (
        <div className="therapist-dashboard">
            <aside className="sidebar">
                <h2>Therapist Portal</h2>
                <Link to="/therapist/dashboard">
                    Dashboard
                </Link>
                <Link to="/therapist/patients">
                    Patients
                </Link>
                <button onClick={logout}>
                    Logout
                </button>
            </aside>
            <main>
                <h1>
                    Welcome,
                    {" "}
                    {user?.name}
                </h1>
                <div className="stats">
                    <div className="card">
                        <h2>
                            {patients.length}
                        </h2>
                        <p>
                            Assigned Patients
                        </p>
                    </div>
                </div>
                <h2>
                    Recent Patients
                </h2>
                {
                    loading ?
                    <p>
                        Loading...
                    </p>
                    :
                    patients.map(patient => (
                        <div
                            key={patient.patient_id}
                            className="patient-card"
                        >
                            <h3>
                                {patient.name}
                            </h3>
                            <p>
                                {patient.email}
                            </p>
                            <p>
                                {patient.diagnosis}
                            </p>
                            <Link
                                to={`/therapist/patient/${patient.patient_id}`}
                            >
                                View Details
                            </Link>
                        </div>
                    ))
                }
            </main>
        </div>
    );
}