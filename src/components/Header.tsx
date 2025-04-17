// src/components/Header.tsx
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function Header() {
    const { user } = useUser();

    return (
        <header className="bg-indigo-600 text-white p-4 flex justify-between">
            <span className="font-bold text-lg">🔧 Mon App IoT</span>
            {user ? (
                <span>👋 Bonjour, {user.username}</span>
            ) : (
                <Link to="/login" className="underline hover:text-gray-300">Se connecter</Link>
            )}
        </header>
    );
}
