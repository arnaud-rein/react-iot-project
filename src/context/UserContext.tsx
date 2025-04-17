import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type User = {
    _id: string;
    username: string;
};

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean; // 👈 nouvelle propriété
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    loading: true, // 👈 par défaut
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // 👈

    useEffect(() => {
        axios
            .get("http://localhost:3000/me", { withCredentials: true })
            .then((res) => setUser(res.data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false)); // ✅
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
