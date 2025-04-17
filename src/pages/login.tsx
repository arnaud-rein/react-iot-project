import { useState } from "react";
import axios from "axios";

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {



            const response = await axios.post(
                "http://localhost:3000/login",
                {
                    username,
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            alert("✅ Connexion réussie !");
            console.log(response.data); // Tu peux gérer ici la session utilisateur

            // TODO : Redirection ou setUser dans un contexte
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
