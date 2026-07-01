import "./WelcomeCard.css";

export default function WelcomeCard({ user, patient }) {
    return (
        <div className="welcome-card">
            <div>
                <h1>
                    Welcome Back,
                    <br />
                    {user?.name || "Patient"}
                </h1>
                <p>
                    Continue your rehabilitation journey.
                </p>
            </div>
            <div className="patient-info">
                <div>
                    <span>Diagnosis</span>
                    <h3>
                        {patient?.diagnosis || "Not Available"}
                    </h3>
                </div>
                <div>
                    <span>Gender</span>
                    <h3>
                        {patient?.gender || "--"}
                    </h3>
                </div>
            </div>
        </div>
    );
}