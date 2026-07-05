import api from "./api";

export async function getDashboard() {
    const response = await api.get(
        "/api/admin/dashboard"
    );
    return response.data;
}

export async function getUsers(filters = {}) {

    const params = new URLSearchParams();

    if (filters.role)
        params.append("role", filters.role);

    if (filters.approved !== undefined)
        params.append(
            "approved",
            filters.approved
        );

    if (filters.search)
        params.append(
            "search",
            filters.search
        );

    const response = await api.get(
        `/api/admin/users?${params.toString()}`
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

async function updateUserStatus(
    id,
    approved
) {

    const response = await api.put(
        `/api/admin/users/${id}/status`,
        null,
        {
            params:{
                is_approved:approved
            }
        }
    );

    return response.data;

}

export default {
    getDashboard,
    getUsers,
    approveTherapist,
    deleteUser,
    updateUserStatus
};