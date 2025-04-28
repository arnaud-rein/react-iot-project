import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJud2FsZDU5IiwiYSI6ImNtOWxmdDd6YjA0cnoyanBqbno3eG5nNG4ifQ.LlNSFQEeGss0f6aOFTnY4A';

const SimpleRouteMap: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    // Coordonnées simples
    const pointA: [number, number] = [13.38879, 52.5191];  // Berlin
    const pointB: [number, number] = [13.39763, 52.5295];  // Autre point à Berlin

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: pointA,
            zoom: 13
        });

        // Marqueurs sur les deux points
        new mapboxgl.Marker().setLngLat(pointA).addTo(mapRef.current);
        new mapboxgl.Marker({ color: 'red' }).setLngLat(pointB).addTo(mapRef.current);

        //coordinates
        const coordinates: [number, number][] = [
            [13.38879, 52.5191],     // Point A
            [13.39763, 52.5295],     // Point B
            [13.41053, 52.5318],     // Point C
            [13.42312, 52.5350]      // Point D
        ];


        // Trajet simple (ligne droite)
        const routeGeoJSON = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: coordinates
            },
            properties: {
                name: "Route vers Berlin",
                info: "Distance: 5km, Durée: 10min"
            }
        }as GeoJSON.Feature<GeoJSON.LineString>;;

        mapRef.current.on('load', () => {
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
                    'line-color': '#000000', // Noir par défaut
                    'line-width': 10
                }
            });

            // Effet Hover : Change la couleur de la ligne
            mapRef.current!.on('mouseenter', 'route-hover-layer', () => {
                mapRef.current!.getCanvas().style.cursor = 'pointer';
                mapRef.current!.setPaintProperty('route-hover-layer', 'line-color', '#ff0000'); // Rouge
            });

            mapRef.current!.on('mouseleave', 'route-hover-layer', () => {
                mapRef.current!.getCanvas().style.cursor = '';
                mapRef.current!.setPaintProperty('route-hover-layer', 'line-color', '#000000'); // Noir
            });

            mapRef.current!.on('click', 'route-hover-layer', (e) => {
                const coordinates = e.lngLat;
                const properties = e.features?.[0].properties;

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(`
<img src="https://m.media-amazon.com/images/I/51Rhp6GWX5L._AC_UF1000,1000_QL80_.jpg" alt="ESP32">
<strong>${properties?.name}</strong><br/>${properties?.info}

`)
                    .addTo(mapRef.current!);
            });

            // Ajuster la vue
            mapRef.current!.fitBounds([pointA, pointB], { padding: 40 });
        });

        return () => {
            mapRef.current?.remove();
        };
    }, []);

    return <div style={{ height: '100vh', width: '100%' }} ref={mapContainerRef} />;
};

export default SimpleRouteMap;
