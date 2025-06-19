import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

export function AreaChart() {
    const [options, setOptions] = useState({
        chart: { id: 'area-chart' },
        xaxis: { categories: [] },
        dataLabels: { enabled: false },
        fill: { opacity: 0.3 }
    });
    const [series, setSeries] = useState([{ name: 'Mesures', data: [] }]);

    useEffect(() => {
        fetch('http://localhost:3000/api/mesures/daily-summary')
            .then(r => r.json())
            .then(data => {
                setOptions(o => ({ ...o, xaxis: { categories: data.map(d => d._id) } }));
                setSeries([{ name: 'Mesures', data: data.map(d => d.count) }]);
            });
    }, []);

    return <Chart options={options} series={series} type="area" width="600" />;
}
