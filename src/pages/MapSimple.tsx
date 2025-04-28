// import { useEffect } from "react";
// import axios from "axios";
import SimpleRouteMap from "../components/mapSimple.tsx"; // chemin à adapter

export default function MapSimple() {
    // const [data, setData] = useState([]);

    // useEffect(() => {
    //     axios.get("http://localhost:3000/iot", { withCredentials: true })
    //         .then((res) => {
    //             console.log("📦 Données reçues :", res.data);
    //             // setData(res.data);
    //         })
    //         .catch((err) => console.error("Erreur lors du fetch IoT", err));
    // }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold p-4">Carte des objets connectés</h1>
            <SimpleRouteMap />
        </div>
    );
}
