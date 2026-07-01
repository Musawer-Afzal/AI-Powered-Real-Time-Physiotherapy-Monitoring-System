import api from "./api";

export async function register(user) {
    const response = await api.post(
        "/api/auth/register",
        user
    );
    return response.data;
}

export async function login(email, password) {
    const response = await api.post(
        "/api/auth/login",
        {
            email,
            password
        }
    );

    localStorage.setItem(
        "token",
        response.data.access_token
    );

    return response.data;
}

export function logout() {
    localStorage.removeItem("token");
}

export default {
    register,
    login,
    logout
};