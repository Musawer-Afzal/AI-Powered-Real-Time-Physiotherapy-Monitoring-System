import { useEffect, useState } from "react";
import adminService from "../../connect_services/adminService";
import ConfirmModal from "../../components/common/ConfirmModal";
import "../../styles/adminUsers.css";

export default function Users() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [patients, setPatients] = useState([]);
    const [pendingTherapists, setPendingTherapists] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const USERS_PER_PAGE = 10;

    async function loadData() {
        try {
            const patientData = await adminService.getUsers({
                role: "patient"
            });

            const therapistData = await adminService.getUsers({
                role: "therapist",
                approved: false
            });

            const users = await adminService.getUsers({
                search,
                role: roleFilter
            });

            setPatients(patientData || []);
            setPendingTherapists(therapistData || []);
            setAllUsers(users || []);
        } catch (error) {
            console.error("Error loading admin data:", error);
        }
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [search, roleFilter]);

    useEffect(() => {
        loadData();
    }, [search, roleFilter]);

    async function approve(id) {
        await adminService.approveTherapist(id);
        loadData();
    }

    async function toggleStatus(user){
        await adminService.updateUserStatus(
            user.id,
            !user.is_approved
        );
        loadData();
    }

    function deleteUser(user){
        setSelectedUser(user);
        setDeleteModalOpen(true);
    }

    async function confirmDelete(){
        await adminService.deleteUser(
            selectedUser.id
        );
        setDeleteModalOpen(false);
        setSelectedUser(null);
        loadData();
    }

    const totalPages = Math.ceil(
        allUsers.length / USERS_PER_PAGE
    );

    function getPageNumbers() {

        if (totalPages <= 7) {
            return [...Array(totalPages)].map((_, i) => i + 1);
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, "...", totalPages];
        }

        if (currentPage >= totalPages - 3) {
            return [
                1,
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            ];
        }

        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages
        ];
    }

    const startIndex =
        (currentPage - 1) * USERS_PER_PAGE;

    const currentUsers =
        allUsers.slice(
            startIndex,
            startIndex + USERS_PER_PAGE
        );

    return (
        <div className="users-page">
            <div className="users-header">
                <div>
                    <h1>User Management</h1>
                    <p>
                        Search, manage and control access for patients and therapists.
                    </p>
                </div>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="patient">Patients</option>
                    <option value="therapist">Therapists</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            {/* All Users Section */}
            <section className="admin-section">
                <div className="section-header">
                    <h2>All Users</h2>
                    <span>{allUsers.length}</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role ${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={user.is_approved ? "status approved" : "status pending"}>
                                        {user.is_approved ? "Approved" : "Pending"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() =>
                        setCurrentPage(currentPage - 1)
                    }
                >
                    Previous
                </button>
                {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                        <span
                            key={index}
                            className="dots"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            className={
                                currentPage === page
                                    ? "page-number active"
                                    : "page-number"
                            }
                            onClick={() =>
                                setCurrentPage(page)
                            }
                        >
                            {page}
                        </button>
                    )
                )}
                <button
                    disabled={
                        currentPage === totalPages ||
                        totalPages === 0
                    }
                    onClick={() =>
                        setCurrentPage(currentPage + 1)
                    }
                >
                    Next
                </button>
            </div>

            {/* Pending Therapist Requests */}
            <section className="admin-section">
                <div className="section-header">
                    <h2>Pending Therapist Requests</h2>
                    <span>{pendingTherapists.length}</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Approve</th>
                            <th>Reject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingTherapists.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    style={{textAlign:"center"}}
                                >
                                <div className="empty-state">
                                    <h3>✓ All therapist requests have been reviewed.</h3>
                                    <p>
                                        There are currently no therapists waiting for approval.
                                    </p>
                                </div>
                            </td>
                            </tr>
                            ) : (
                            pendingTherapists.map(user=>(
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                    <td>
                                        <button
                                            className="approve"
                                            onClick={()=>approve(user.id)}
                                        >
                                        Approve
                                        </button>
                                    </td>
                                <td>
                                    <button
                                    className="reject"
                                    onClick={()=>toggleStatus(user)}
                                    >
                                    Reject
                                    </button>
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>

            {/* Patients Section */}
            <section className="admin-section">
                <div className="section-header">
                    <h2>Patients</h2>
                    <span>{patients.length}</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Disable</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={user.is_approved ? "status active" : "status disabled"}>
                                        {user.is_approved ? "Active" : "Disabled"}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="reject"
                                        onClick={() => toggleStatus(user)}
                                    >
                                        {user.is_approved ? "Disable" : "Enable"}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="delete"
                                        onClick={() => deleteUser(user)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <ConfirmModal
                open={deleteModalOpen}
                title="Delete User"
                message={
                    selectedUser
                    ? `Are you sure you want to permanently delete ${selectedUser.name} (${selectedUser.email})? This action cannot be undone.`
                    : ""
                }
                confirmText="Delete"
                cancelText="Cancel"
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setSelectedUser(null);
                }}
                onConfirm={confirmDelete}
            />
        </div>
    );
}