import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import therapistService from "../../connect_services/therapistService";

import "./Patients.css";

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [uuid, setUuid] = useState("");

    async function loadPatients() {
        try {
            const data =
                await therapistService.getMyPatients();
            setPatients(data);
            setFilteredPatients(data);
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        const result = patients.filter(patient =>
            patient.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
        setFilteredPatients(result);
    }, [search, patients]);

    async function handleAddPatient() {
        if (!uuid.trim()) return;
        try {
            await therapistService.addPatient(uuid);
            setUuid("");
            await loadPatients();
            alert("Patient Added");
        }
        catch {
            alert("Unable to add patient");
        }
    }
    return (
        <div className="patients-page">
            <div className="patients-header">
                <h1>
                    My Patients
                </h1>
                <div className="top-controls">
                    <input
                        type="text"
                        placeholder="Search patient..."
                        value={search}
                        onChange={(e)=>
                            setSearch(e.target.value)
                        }
                    />
                    <input
                        type="text"
                        placeholder="Patient UUID"
                        value={uuid}
                        onChange={(e)=>
                            setUuid(e.target.value)
                        }
                    />
                    <button
                        onClick={handleAddPatient}
                    >
                        Add Patient
                    </button>
                </div>
            </div>
            {
                filteredPatients.map(patient=>(
                    <div
                        className="patient-card"
                        key={patient.patient_id}
                    >
                        <h3>
                            {patient.name}
                        </h3>
                        <p>
                            {patient.email}
                        </p>
                        <p>
                            Diagnosis:
                            {" "}
                            {patient.diagnosis}
                        </p>
                        <p>
                            Gender:
                            {" "}
                            {patient.gender}
                        </p>
                        <Link
                            to={`/therapist/patient/${patient.patient_id}`}
                        >
                            View Details
                        </Link>
                    </div>
                ))
            }
        </div>
    );
}