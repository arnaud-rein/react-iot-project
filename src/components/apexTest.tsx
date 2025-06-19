import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

export default function TestChart() {
    // États pour les options et la série
    const [options, setOptions] = useState({
        chart: { id: 'basic-bar' },
        xaxis: { categories: [] }
    });
    const [series, setSeries] = useState([
        { name: 'Nombre de mesures', data: [] }
    ]);

    useEffect(() => {
        // Récupère les données au montage
        fetch('http://localhost:3000/api/mesures/daily-summary')
            .then(response => {
                if (!response.ok) throw new Error('Erreur réseau');
                return response.json();
            })
            .then(data => {
                // extrait les dates et les counts
                const categories = data.map(item => item._id);
                const counts     = data.map(item => item.count);

                // met à jour les états
                setOptions(opt => ({
                    ...opt,
                    xaxis: { categories }
                }));
                setSeries([{ name: 'Nombre de mesures', data: counts }]);
            })
            .catch(err => {
                console.error('Impossible de charger les données :', err);
            });
    }, []);

    return (
        <div>
            <Chart
                options={options}
                series={series}
                type="bar"
                width="500"
            />
        </div>
    );
}
