import api from "./api";

const userService = {

    async getMe() {

        const response =
            await api.get("/api/users/me");

        return response.data;

    }

};

export default userService;