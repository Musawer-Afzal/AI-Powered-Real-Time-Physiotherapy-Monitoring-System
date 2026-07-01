import api from "./api";

export async function startSession(data) {
    const response = await api.post(
        "/api/sessions/start",
        data
    );

    return response.data;
}

export async function finishSession(
    sessionId,
    data
) {
    const response = await api.put(
        `/api/sessions/${sessionId}/finish`,
        data
    );

    return response.data;
}

export async function getMySessions() {
    const response = await api.get(
        "/api/sessions/me"
    );

    return response.data;
}

export default {
    startSession,
    finishSession,
    getMySessions
};