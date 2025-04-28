import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJud2FsZDU5IiwiYSI6ImNtOWxmdDd6YjA0cnoyanBqbno3eG5nNG4ifQ.LlNSFQEeGss0f6aOFTnY4A';

const RouteToggleMap: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [visibleRoutes, setVisibleRoutes] = useState<string[]>([]);

    const routes = [
        {
            id: 'route1',
            name: 'Trajet 1',
            color: '#FF4136', // Rouge
            coordinates: [
                [13.38879, 52.5191],
                [13.39763, 52.5295]
            ]
        },
        {
            id: 'route2',
            name: 'Trajet 2',
            color: '#367cff', // Rouge
            coordinates: [
                [13.38879, 52.5191],
                [13.39763, 52.5295]
            ]
        },
        {
            id: 'route3',
            name: 'Trajet 3',
            color: '#ffe436', // Rouge
            coordinates: [
                [13.38879, 52.5191],
                [13.39763, 52.5295]
            ]
        }
    ];

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [13.38879, 52.5191],
            zoom: 12
        });

        return () => {
            mapRef.current?.remove();
        };
    }, []);

    // Ajouter ou retirer une ligne selon la sélection
    useEffect(() => {
        if (!mapRef.current) return;

        routes.forEach(route => {
            const exists = mapRef.current!.getLayer(route.id);

            if (visibleRoutes.includes(route.id)) {
                if (!exists) {
                    // Ajoute la ligne si elle n'existe pas encore
                    mapRef.current!.addSource(route.id, {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: route.coordinates
                            },
                            properties: {
                                name: route.name
                            }
                        }
                    });

                    mapRef.current!.addLayer({
                        id: route.id,
                        type: 'line',
                        source: route.id,
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': route.color,
                            'line-width': 6
                        }
                    });
                }
            } else {
                if (exists) {
                    // Supprime la ligne si elle est visible mais décochée
                    mapRef.current!.removeLayer(route.id);
                    mapRef.current!.removeSource(route.id);
                }
            }
        });
    }, [visibleRoutes]);

    // Toggle handler
    const toggleRoute = (id: string) => {
        setVisibleRoutes(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    return (
        <>
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, background: 'white', padding: '10px', borderRadius: '5px' }}>
                {routes.map(route => (
                    <div key={route.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={visibleRoutes.includes(route.id)}
                                onChange={() => toggleRoute(route.id)}
                            />
                            {route.name}
                        </label>
                    </div>
                ))}
            </div>
            <div style={{ height: '100vh', width: '100%' }} ref={mapContainerRef} />
        </>
    );
};

export default RouteToggleMap;
