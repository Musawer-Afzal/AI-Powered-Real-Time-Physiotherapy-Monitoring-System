import { useEffect, useState } from "react";
import adminService from "../../connect_services/adminService";

export default function Users() {
    const [users, setUsers] = useState([]);

    async function loadUsers() {
        const data = await adminService.getUsers();
        setUsers(data);
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function approve(id) {
        await adminService.approveTherapist(id);
        loadUsers();
    }

    async function remove(id) {
        if (!window.confirm("Delete this user?"))
            return;
        await adminService.deleteUser(id);
        loadUsers();
    }

    return (
        <div className="users-page">
            <h2>User Management</h2>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {user.is_approved
                                    ? "Approved"
                                    : "Pending"}
                            </td>
                            <td>
                                {user.role === "therapist" &&
                                    !user.is_approved && (
                                    <button
                                        onClick={() => approve(user.id)}
                                    >
                                        Approve
                                    </button>
                                )}
                                <button
                                    onClick={() => remove(user.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}