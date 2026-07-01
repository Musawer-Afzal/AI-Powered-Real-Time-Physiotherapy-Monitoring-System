import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminService from "../../connect_services/adminService";

import "./Dashboard.css";

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            const data =
                await adminService.getDashboard();
            setStats(data);
        }
        catch (err) {
            console.error(err);
        }
    }

    if (!stats)
        return <h2>Loading...</h2>;
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h2>{stats.users}</h2>
                    <p>Total Users</p>
                </div>
                <div className="dashboard-card">
                    <h2>{stats.patients}</h2>
                    <p>Patients</p>
                </div>
                <div className="dashboard-card">
                    <h2>{stats.therapists}</h2>
                    <p>Therapists</p>
                </div>
                <div className="dashboard-card">
                    <h2>{stats.sessions}</h2>
                    <p>Sessions</p>
                </div>
                <div className="dashboard-card pending">
                    <h2>
                        {stats.pending_therapists}
                    </h2>
                    <p>
                        Pending Approvals
                    </p>
                </div>
                <div className="dashboard-actions">
                    <Link
                        className="action-btn"
                        to="/admin/users"
                    >
                        User Management
                    </Link>
                </div>
            </div>
        </div>
    );
}