import api from "./api";

export async function registerTherapist(data) {
    const response = await api.post(
        "/api/therapist/register",
        data
    );

    return response.data;
}

export async function addPatient(patient_uuid) {
    const response = await api.post(
        "/api/therapist/add-patient",
        {
            patient_uuid
        }
    );

    return response.data;
}

export async function getMyPatients() {
    const response = await api.get(
        "/api/therapist/my-patients"
    );

    return response.data;
}

export async function getPatientDetails(patientId) {
    const response = await api.get(
        `/api/therapist/patient/${patientId}`
    );

    return response.data;
}

export async function updateNotes(id, notes) {
    const response = await api.put(
        `/api/therapist/patient/${id}/notes`,
        {
            therapist_notes: notes
        }
    );

    return response.data;
}

export default {
    registerTherapist,
    addPatient,
    getMyPatients,
    getPatientDetails,
    updateNotes
};