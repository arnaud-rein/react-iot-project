import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./index.css";

// Déclaration des routes
const router = createBrowserRouter([
    {
        path: "/",
        element: <div className="text-2xl font-bold text-indigo-600">Hello world!</div>,
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
