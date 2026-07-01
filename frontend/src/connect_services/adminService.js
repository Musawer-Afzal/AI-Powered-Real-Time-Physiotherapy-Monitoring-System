import api from "./api";

export async function getDashboard() {
    const response = await api.get(
        "/api/admin/dashboard"
    );
    return response.data;
}

export async function getUsers() {
    const response = await api.get(
        "/api/admin/users"
    );
    return response.data;
}

export async function approveTherapist(id) {
    const response = await api.put(
        `/api/admin/approve/${id}`
    );
    return response.data;
}

export async function deleteUser(id) {
    const response = await api.delete(
        `/api/admin/users/${id}`
    );
    return response.data;
}

export default {
    getDashboard,
    getUsers,
    approveTherapist,
    deleteUser
};