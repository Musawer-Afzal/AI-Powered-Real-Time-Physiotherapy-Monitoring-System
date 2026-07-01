import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

import WelcomeCard from "../../components/patient/dashboard/WelcomeCard";
import StatCard from "../../components/patient/dashboard/StatCard";
import RecentSessions from "../../components/patient/dashboard/RecentSessions";

import patientService from "../../connect_services/patientService";
import sessionService from "../../connect_services/sessionService";

import "./Dashboard.css";

export default function Dashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const patientData = await patientService.getPatientProfile();
                setProfile(patientData);
            } catch (err) {
                console.error("Failed to fetch patient profile:", err);
                setProfile(null);
            }

            try {
                const sessionData = await sessionService.getMySessions();
                setSessions(sessionData);
            } catch (err) {
                console.error("Failed to fetch sessions:", err);
            }
        }

        loadDashboard();
    }, []);

    return (
        <div className="dashboard-container">
            <h2>Welcome, {user?.name}</h2>
            <div className="stats-grid">
                <StatCard
                    title="Sessions"
                    value={sessions.length}
                    color="#3E92CC"
                />
                <StatCard
                    title="Good Reps"
                    value={sessions.reduce((sum, s) => sum + s.good_reps, 0)}
                    color="#4CAF50"
                />
                <StatCard
                    title="Avg Score"
                    value={
                        sessions.length
                            ? Math.round(
                                  sessions.reduce((sum, s) => sum + s.average_form_score, 0) /
                                      sessions.length
                              ) + "%"
                            : "0%"
                    }
                    color="#FF9800"
                />
                <StatCard
                    title="Exercises"
                    value={new Set(sessions.map((s) => s.exercise_name)).size}
                    color="#9C27B0"
                />
            </div>
            <div className="sessions-card">
                <h3>Recent Sessions</h3>
                {sessions.length === 0 ? (
                    <p>No exercise sessions yet.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Exercise</th>
                                <th>Reps</th>
                                <th>Good</th>
                                <th>Score</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session) => (
                                <tr key={session.id || session._id}>
                                    <td>{session.exercise_name}</td>
                                    <td>{session.total_reps}</td>
                                    <td>{session.good_reps}</td>
                                    <td>{session.average_form_score}%</td>
                                    <td>{session.duration_seconds}s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}