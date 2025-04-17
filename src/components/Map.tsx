import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

mapboxgl.accessToken = "pk.eyJ1IjoiYXJud2FsZDU5IiwiYSI6ImNtOWxmdDd6YjA0cnoyanBqbno3eG5nNG4ifQ.LlNSFQEeGss0f6aOFTnY4A"; // 🔐 remplace par ton token

interface MarkerData {
    id: string;
    name: string;
    position: {
        latitude: number;
        longitude: number;
    };
}

interface MapProps {
    markers: MarkerData[];
}

export default function Map({ markers }: MapProps) {
    const mapContainer = useRef(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current!,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [2.3488, 48.8534], // 👈 Paris par défaut
            zoom: 10,
        });

        markers.forEach((marker) => {
            new mapboxgl.Marker()
                .setLngLat([marker.position.longitude, marker.position.latitude])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${marker.name}</h3>`))
                .addTo(map);
        });

        return () => map.remove(); // nettoyage
    }, [markers]);

    return <div ref={mapContainer} className="w-full h-screen" />;
}
