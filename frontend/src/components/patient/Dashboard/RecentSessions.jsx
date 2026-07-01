import "./RecentSessions.css";

export default function RecentSessions({ sessions }) {
    return (
        <div className="recent-sessions">
            <h2>
                Recent Sessions
            </h2>
            <table>
                <thead>
                    <tr>
                        <th>Exercise</th>
                        <th>Reps</th>
                        <th>Score</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.length === 0 && (
                        <tr>
                            <td colSpan="4">
                                No sessions yet.
                            </td>
                        </tr>
                    )}
                    {sessions.map(session => (
                        <tr key={session.id}>
                            <td>{session.exercise_name}</td>
                            <td>{session.total_reps}</td>
                            <td>{session.average_form_score}%</td>
                            <td>{session.duration_seconds}s</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}