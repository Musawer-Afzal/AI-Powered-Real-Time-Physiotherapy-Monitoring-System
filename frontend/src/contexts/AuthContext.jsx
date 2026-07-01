import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import authService from "../connect_services/authService";
import userService from "../connect_services/userservice";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [loading, setLoading] = useState(true);
    useEffect(() => {

        async function restoreUser() {

            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const me = await userService.getMe();
                setUser(me);
            }
            catch {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            }
            setLoading(false);
        }
        restoreUser();
    }, [token]);

    async function login(email, password) {

        const response =
            await authService.login(email, password);
        setToken(response.access_token);
        const me = await userService.getMe();
        setUser(me);
        return me;
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}