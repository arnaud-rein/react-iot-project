import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    // 🔁 D'où vient l'utilisateur (ex: /dashboard)
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:3000/login",
                { username, password },
                { withCredentials: true }
            );

            setUser(response.data.user);
            console.log("✅ Connexion réussie :", response.data.user);

            navigate(from); // ⬅️ redirige vers la page d’origine
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert("❌ Erreur : " + (error.response?.data?.message || "Inconnue"));
            } else {
                console.error("Erreur inattendue :", error);
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
            >
                <h1 className="text-xl font-bold text-center text-indigo-600">Connexion</h1>

                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nom d'utilisateur"
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="w-full p-2 border rounded"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                >
                    Se connecter
                </button>
            </form>
        </div>
    );
}
