import "./StatCard.css";

export default function StatCard({ title, value, color }) {
    return (
        <div
            className="stat-card"
            style={{ borderLeft: `6px solid ${color}` }}
        >
            <p>{title}</p>
            <h2>{value}</h2>
        </div>
    );
}