import api from "./api";

export async function getExercises() {

    const response = await api.get(
        "/api/exercises"
    );

    return response.data;

}