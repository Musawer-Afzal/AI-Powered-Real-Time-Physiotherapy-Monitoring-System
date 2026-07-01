import api from "./api";

export async function getPatientProfile() {

    const response = await api.get(
        "/api/patients/me"
    );

    return response.data;
}

export async function createPatientProfile(data) {

    const response = await api.post(
        "/api/patients",
        data
    );

    return response.data;
}

export default {
    getPatientProfile,
    createPatientProfile
};