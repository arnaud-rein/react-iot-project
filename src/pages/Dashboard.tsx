// src/pages/Dashboard.tsx
import { useUser } from "../context/UserContext.tsx";

export default function Dashboard() {
    const { user } = useUser();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 text-indigo-600">🏠 Dashboard</h1>
            <p className="text-lg">
                Bienvenue sur ton espace personnel, <strong>{user?.username}</strong> 👋
            </p>
            <a
                href="/iot"
                className="inline-block mt-6 text-indigo-600 underline hover:text-indigo-800"
            >
                ➤ Voir les données IoT
            </a>

        </div>
    );
}
