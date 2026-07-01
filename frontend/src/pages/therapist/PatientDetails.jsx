import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import therapistService from "../../connect_services/therapistService";

import "./PatientDetails.css";

export default function PatientDetails() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [notes, setNotes] = useState("");

    async function loadPatient() {
        try {
            const data =
                await therapistService.getPatientDetails(id);
            setPatient(data.patient);
            setStatistics(data.statistics);
            setSessions(data.sessions);
            setNotes(data.patient.therapist_notes || "");
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadPatient();
    }, []);

    async function saveNotes() {
        try {
            await therapistService.updateNotes(id, notes);
            alert("Notes Updated");
        }
        catch {
            alert("Unable to save");
        }
    }
    if (!patient) {
        return <h2>Loading...</h2>;
    }
    return (
        <div className="patient-details">
            <div className="patient-header">
                <h1>
                    {patient.name}
                </h1>
                <p>{patient.email}</p>
            </div>
            <div className="info-grid">
                <div className="card">
                    <h3>Gender</h3>
                    <p>{patient.gender || "-"}</p>
                </div>
                <div className="card">
                    <h3>DOB</h3>
                    <p>{patient.date_of_birth || "-"}</p>
                </div>
                <div className="card">
                    <h3>Diagnosis</h3>
                    <p>{patient.diagnosis || "-"}</p>
                </div>
            </div>
            <h2>Statistics</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>{statistics.total_sessions}</h3>
                    <span>Sessions</span>
                </div>
                <div className="stat-card">
                    <h3>{statistics.total_reps}</h3>
                    <span>Total Reps</span>
                </div>
                <div className="stat-card">
                    <h3>{statistics.good_reps}</h3>
                    <span>Good Reps</span>
                </div>
                <div className="stat-card">
                    <h3>{statistics.average_score}%</h3>
                    <span>Average Score</span>
                </div>
            </div>
            <h2>Exercise History</h2>
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Exercise</th>
                        <th>Reps</th>
                        <th>Good</th>
                        <th>Score</th>
                        <th>Duration</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sessions.map(session => (
                            <tr key={session.id}>
                                <td>{session.exercise}</td>
                                <td>{session.reps}</td>
                                <td>{session.good_reps}</td>
                                <td>{session.score}%</td>
                                <td>{session.duration}s</td>
                                <td>
                                    {new Date(session.date).toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <h2>Therapist Notes</h2>
            <textarea
                value={notes}
                onChange={(e)=>setNotes(e.target.value)}
            />
            <button
                className="save-btn"
                onClick={saveNotes}
            >
                Save Notes
            </button>
        </div>
    );
}