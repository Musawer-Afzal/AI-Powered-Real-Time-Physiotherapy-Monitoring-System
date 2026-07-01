import { useState } from "react"; // 1. Import useState
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./PatientLayout.css";

export default function PatientLayout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    const [isCollapsed, setIsCollapsed] = useState(false);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <div className={`patient-layout ${isCollapsed ? "sidebar-collapsed" : ""}`}>            
            <aside className="portal-sidebar">
                <button 
                    className="sidebar-toggle-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
                >
                    {isCollapsed ? "➡️" : "⬅️"}
                </button>
                <div className="sidebar-content-wrapper">
                    <div className="logo">
                        <h2>{isCollapsed ? "P" : "PhysioAI"}</h2>
                        {!isCollapsed && <p>Patient Portal</p>}
                    </div>
                    <nav>
                        <NavLink to="/patient/dashboard" title="Dashboard">
                            <span>📊</span> {!isCollapsed && "Dashboard"}
                        </NavLink>
                        <NavLink to="/patient/exercise" title="Exercise">
                            <span>🏋️‍♂️</span> {!isCollapsed && "Exercise"}
                        </NavLink>
                        <NavLink to="/patient/progress" title="Progress">
                            <span>📈</span> {!isCollapsed && "Progress"}
                        </NavLink>
                        <NavLink to="/patient/profile" title="Profile">
                            <span>👤</span> {!isCollapsed && "Profile"}
                        </NavLink>
                    </nav>
                </div>

                <div className="sidebar-footer">
                    {!isCollapsed && <h4>{user?.name}</h4>}
                    <button onClick={handleLogout} title="Logout">
                        {isCollapsed ? "🚪" : "Logout"}
                    </button>
                </div>
            </aside>

            <main className="patient-page">
                <Outlet />
            </main>
        </div>
    );
}