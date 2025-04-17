import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./index.css";

import { useState } from "react";

function Home() {
    const [count, setCount] = useState(0);

    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-indigo-600 mb-4">Compteur React ⚛️</h1>
            <p className="text-lg mb-2">Valeur : <span className="font-mono">{count}</span></p>
            <button
                onClick={() => setCount(count + 1)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
            >
                + Incrémenter
            </button>
        </div>
    );
}

// Déclaration des routes
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
]);

// Vérifie que l'élément root existe
const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element not found. Assure-toi que <div id='root'></div> existe dans index.html");
}

// Crée la racine React et rend l'application
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
