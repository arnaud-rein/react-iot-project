import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./index.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapPage from "./pages/MapPage";
import Login from "./pages/login";
import { useState } from "react";
import { UserProvider } from "./context/UserContext"; // ✅ nouveau
import Dashboard from "./pages/Dashboard"; // ou ton chemin
import Iot from "./pages/iot"; // ou ton chemin
import PrivateRoute from "./components/PrivateRoute";
import MapPageChemin from "./pages/cheminMap.tsx"; // chemin vers PrivateRout
import MapSimple from "./pages/MapSimple.tsx";
import MapSimpleAmeliore from "./pages/MapSimpleAmeliore.tsx"; // chemin vers PrivateRout

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

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    },
    {
        path: "/iot",
        element: (
            <PrivateRoute>
                <Iot />
            </PrivateRoute>
        )
    },

    {
        path: "/map",
        element: (
                <MapPage />
        ),
    },

    {
        path: "/mapPath",
        element: (
                <MapPageChemin />
        ),
    },
    {
        path: "/mapSimple",
        element: (
                <MapSimple />
        ),
    },
    {
        path: "/mapSimpleAmeliore",
        element: (
                <MapSimpleAmeliore />
        ),
    }

]);

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element not found. Assure-toi que <div id='root'></div> existe dans index.html");
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
    </React.StrictMode>
);
