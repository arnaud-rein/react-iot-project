import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJud2FsZDU5IiwiYSI6ImNtOWxmdDd6YjA0cnoyanBqbno3eG5nNG4ifQ.LlNSFQEeGss0f6aOFTnY4A';

const SimpleRouteMap: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [showSkipMessage, setShowSkipMessage] = React.useState(false);

    // Coordonnées simples
    // const pointA: [number, number] = [13.38879, 52.5191];  // Berlin
    // const pointB: [number, number] = [13.39763, 52.5295];  // Autre point à Berlin

    const handleEnterKey = (e: KeyboardEvent) => {
            console.log('e.key');
        if (e.key === 'Escape') {
            const el = document.querySelector("#testFocus");
            if (el) {
                el.focus();
            }
        }
    }

    useEffect(() => {
        const handleShortcutHelpToggle = (e: KeyboardEvent) => {
            if (e.shiftKey && e.key === '?') {
                e.preventDefault();
                setShowShortcutHelp((prev) => !prev);
            }

            if (e.key === 'Escape' && showShortcutHelp) {
                setShowShortcutHelp(false);
            }
        };

        window.addEventListener('keydown', handleShortcutHelpToggle);
        return () => window.removeEventListener('keydown', handleShortcutHelpToggle);
    }, [showShortcutHelp]);





    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [2.3522, 48.8566], // Paris par défaut
            zoom: 5
        });


    // Juste après const mapRef = useRef...
    const staticMarkers = [
        { lon: 3.057256, lat: 50.62925, label: "Lille Centre" },
        { lon: 3.060, lat: 50.632, label: "Gare Lille Flandres" },
        { lon: 3.057, lat: 50.627, label: "Palais des Beaux-Arts" },
        { lon: 3.053, lat: 50.633, label: "Parc Henri Matisse" },
        { lon: 3.048, lat: 50.631, label: "Citadelle de Lille" },
        { lon: 3.066, lat: 50.627, label: "Université Lille Droit" },
        { lon: 3.061, lat: 50.635, label: "Grand Place" },
        { lon: 3.068, lat: 50.630, label: "Hospice Comtesse" },
        { lon: 3.059, lat: 50.638, label: "Euralille" },
        { lon: 3.050, lat: 50.636, label: "Zoo de Lille" },
    ];

    staticMarkers.forEach((point) => {
        new mapboxgl.Marker({ color: "#3b82f6" }) // bleu (optionnel)
            .setLngLat([point.lon, point.lat])
            .setPopup(
                new mapboxgl.Popup().setHTML(`
        <strong>${point.label}</strong><br/>
        (${point.lat.toFixed(4)}, ${point.lon.toFixed(4)})
      `)
            )
            .addTo(mapRef.current!);
    });

        axios.get('http://localhost:3000/iot/date/2025-05-11', { withCredentials: true })
            .then(response => {
                const devices = response.data;
                // console.log("voici les devices : " + devices.data.position.latitude);
                const coordinates: [number, number][] = devices.map((device: any) => [
                    device.position.longitude,
                    device.position.latitude
                ]);

                // Ajouter les marqueurs
                devices.forEach((device: any) => {
                    const { latitude, longitude } = device.position;

                    new mapboxgl.Marker()
                        .setLngLat([2.287592,48.862725])
                        .setPopup(
                            new mapboxgl.Popup().setHTML(`
                            <strong>${device.name}</strong><br/>
                            Lat: ${latitude}<br/>
                            Lng: ${longitude}
                        `)
                        )
                        .addTo(mapRef.current!);
                });

                const routeGeoJSON = {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates
                    },
                    properties: {
                        name: "Parcours IoT",
                        info: `Nombre de poi    nts : ${coordinates.length}`
                    }
                } as GeoJSON.Feature<GeoJSON.LineString>;




                mapRef.current!.on('load', () => {
                    mapRef.current!.addSource('route-hover', {
                        type: 'geojson',
                        data: routeGeoJSON
                    });

                    mapRef.current!.addLayer({
                        id: 'route-hover-layer',
                        type: 'line',
                        source: 'route-hover',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#000000',
                            'line-width': 10
                        }
                    });

                    mapRef.current!.on('mouseenter', 'route-hover-layer', () => {
                        mapRef.current!.getCanvas().style.cursor = 'pointer';
                        mapRef.current!.setPaintProperty('route-hover-layer', 'line-color', '#ff0000');
                    });

                    mapRef.current!.on('mouseleave', 'route-hover-layer', () => {
                        mapRef.current!.getCanvas().style.cursor = '';
                        mapRef.current!.setPaintProperty('route-hover-layer', 'line-color', '#000000');
                    });

                    mapRef.current!.on('click', 'route-hover-layer', (e) => {
                        const coordinates = e.lngLat;
                        const properties = e.features?.[0].properties;

                        new mapboxgl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(`
                            <img src="https://m.media-amazon.com/images/I/51Rhp6GWX5L._AC_UF1000,1000_QL80_.jpg" alt="ESP32" />
                            <strong>${properties?.name}</strong><br/>${properties?.info}
                        `)
                            .addTo(mapRef.current!);
                    });

                    // Fit bounds automatiquement
                    const bounds = new mapboxgl.LngLatBounds();
                    coordinates.forEach(coord => bounds.extend(coord));
                    mapRef.current!.fitBounds(bounds, { padding: 50 });
                });
            })
            .catch(error => {
                console.error('Erreur API /iot :', error);
            });

        return () => {
            mapRef.current?.remove();
        };
    }, []);


    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
            {/* 🔵 Message d'aide clavier au focus */}
            {showSkipMessage && (
                <div
                    style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        backgroundColor: '#1f6feb',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        zIndex: 1000,
                        fontSize: '14px',
                    }}
                    role="alert"
                >
                    🎯 Carte active – appuyez sur <kbd>Enter</kbd> pour skip cette partie
                </div>
            )}

            {/* 🗺️ Carte Mapbox elle-même */}
            <div
                ref={mapContainerRef}
                id="map"
                tabIndex={0}
                role="application"
                aria-label="Carte interactive des dispositifs"
                style={{ height: '100%', width: '100%' }}
                onFocus={() =>{

                    setShowSkipMessage(true);
                    window.addEventListener('keydown', handleEnterKey); // 👈 AJOUT ICI
                }
            }
                onBlur={() => {
                    setShowSkipMessage(false)
                    window.removeEventListener('keydown', handleEnterKey); // 👈 SUPPRESSION ICI
                }
            }
            />


            {showShortcutHelp && (
                <div
                    style={{
                        position: 'fixed',
                        top: '20%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '24px',
                        width: '400px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        fontSize: '14px',
                    }}
                    role="dialog"
                    aria-modal="true"
                >
                    <h2 style={{ marginTop: 0 }}>⌨️ Raccourcis clavier</h2>
                    <ul style={{ paddingLeft: '20px' }}>
                        <li><kbd>Ctrl + M</kbd> → Focus carte</li>
                        <li><kbd>Échap</kbd> → Sortir de la carte</li>
                        <li><kbd>Entrée</kbd> → Aller à la section suivante</li>
                        <li><kbd>Shift + ?</kbd> → Ouvrir cette aide</li>
                    </ul>
                    <button
                        onClick={() => setShowShortcutHelp(false)}
                        style={{
                            marginTop: '12px',
                            padding: '6px 12px',
                            border: 'none',
                            backgroundColor: '#1f6feb',
                            color: 'white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Fermer
                    </button>
                </div>
            )}

        </div>

    );


};



export default SimpleRouteMap;
