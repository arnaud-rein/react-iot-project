import { useEffect, useState } from "react";
import axios from "axios";

type IotData = {
    _id: string;
    name: string;
    position: {
        latitude: number;
        longitude: number;
    };
    rawMessage: string;
    createdAt: string;
};

export default function Iot() {
    const [data, setData] = useState<IotData[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3000/iot", {
            withCredentials: true,
        })
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error(err);
                setError("Impossible de récupérer les données IoT.");
            });
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-indigo-600 mb-4">📡 Données IoT</h1>

            {error && <p className="text-red-500">{error}</p>}

            {data.length === 0 && !error && (
                <p className="text-gray-500">Aucune donnée IoT disponible.</p>
            )}

            <ul className="space-y-4">
                {data.map((iot) => (
                    <li key={iot._id} className="p-4 bg-white rounded shadow">
                        <p className="font-bold text-indigo-700">📍 {iot.name}</p>
                        <p>
                            Position : {iot.position.latitude.toFixed(4)} /{" "}
                            {iot.position.longitude.toFixed(4)}
                        </p>
                        <p className="text-sm text-gray-600">Raw : {iot.rawMessage}</p>
                        <p className="text-sm text-gray-500">
                            Créé le : {new Date(iot.createdAt).toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
