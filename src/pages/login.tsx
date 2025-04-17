import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Tentative de login avec :\nEmail: ${email}\nPassword: ${password}`);
        // 🔐 Ici, tu pourrais envoyer une requête à une API
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
            >
                <h1 className="text-xl font-bold text-center text-indigo-600">Connexion</h1>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse e-mail"
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
