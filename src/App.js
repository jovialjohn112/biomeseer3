import React, { useState } from "react";
// Removed unused icons to fix ESLint warning
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const plotOptions = ["Plot 1", "Plot 2", "Plot 3"];
const timeOptions = ["Rabi", "Zaid", "Kharif"];

export default function BiomeSeerDashboard() {
  const [selectedPlot, setSelectedPlot] = useState("Plot 1");
  const [selectedTime, setSelectedTime] = useState("Rabi");

  const dynamicStackedBarData = {
    labels: [selectedPlot],
    datasets: [
      {
        label: "Actinobacteria",
        data: [30],
        backgroundColor: "#34d399"
      },
      {
        label: "Proteobacteria",
        data: [20],
        backgroundColor: "#60a5fa"
      },
      {
        label: "Firmicutes",
        data: [15],
        backgroundColor: "#facc15"
      }
    ]
  };

  const dynamicRarefactionData = {
    labels: [1, 2, 3, 4, 5],
    datasets: [
      {
        label: `${selectedPlot} Rarefaction Curve - ${selectedTime}`,
        data: [5, 12, 18, 25, 31],
        borderColor: "#6366f1",
        backgroundColor: "#c7d2fe"
      }
    ]
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f7fafc' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo-biomeseer.png" alt="BiomeSeer Logo" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#065f46' }}>BiomeSeer Dashboard</h1>
        </div>
        <button style={{ padding: '8px 12px', border: '1px solid gray', borderRadius: '5px' }}>Language</button>
      </div>

      {/* Tabs - only showing one tab for simplicity */}
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#047857' }}>Microbial Diversity</h2>

        <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
          <select
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            value={selectedPlot}
            onChange={(e) => setSelectedPlot(e.target.value)}
          >
            {plotOptions.map((plot) => (
              <option key={plot} value={plot}>{plot}</option>
            ))}
          </select>
          <select
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <Bar data={dynamicStackedBarData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginTop: '20px' }}>
          <Line data={dynamicRarefactionData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
      </div>
    </div>
  );
}
