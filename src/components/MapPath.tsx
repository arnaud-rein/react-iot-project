import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


const MapboxExample: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXJud2FsZDU5IiwiYSI6ImNtOWxmdDd6YjA0cnoyanBqbno3eG5nNG4ifQ.LlNSFQEeGss0f6aOFTnY4A';

        if (mapContainerRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                center: [3.054754188174144,
                    50.64144851326833],
                zoom: 16.9,
                pitch: 30,
                bearing: 50,
                style: 'mapbox://styles/mapbox/streets-v12',
                minZoom: 5,
                maxZoom: 22
            });

            mapRef.current.on('style.load', () => {
                mapRef.current?.loadImage(
                    'https://docs.mapbox.com/mapbox-gl-js/assets/pattern-dot.png',
                    (error, image) => {
                        if (error || !image || !mapRef.current) return;

                        if (!mapRef.current.hasImage('pattern-dot')) {
                            mapRef.current.addImage('pattern-dot', image);
                        }

                        mapRef.current.addSource('route-data', {
                            type: 'geojson',
                            lineMetrics: true,
                            data: {
                                type: 'Feature',
                                geometry: {
                                    "coordinates": [
                                        [
                                            [
                                                3.054754188174144,
                                                50.64144851326833
                                            ],
                                            [
                                                3.056624176323254,
                                                50.639126778282844
                                            ],
                                            [
                                                3.058204447997099,
                                                50.63974480527273
                                            ],
                                            [
                                                3.056571500600228,
                                                50.64203310472038
                                            ],
                                            [
                                                3.054754188174144,
                                                50.64144851326833
                                            ]
                                        ]
                                    ],
                                    "type": "Polygon",
                                },
                                properties: {} // <- requis par TypeScript
                            }
                        });

                        const lineBaseWidth = 14;

                        mapRef.current.addLayer({
                            id: 'route-line',
                            type: 'line',
                            source: 'route-data',
                            layout: {
                                'line-join': 'round'
                            },
                            paint: {
                                'line-pattern': 'pattern-dot',
                                'line-width': [
                                    'interpolate',
                                    ['exponential', 2],
                                    ['zoom'],
                                    15, lineBaseWidth,
                                    22, lineBaseWidth * 2
                                ]
                            }
                        });
                    }
                );
            });
        }

        // Cleanup
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    return <div style={{ height: '100vh', width: '100%' }} ref={mapContainerRef} />;
};

export default MapboxExample;
