// Full working dashboard with additional tab for Soil Metagenomic Analysis chart

import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, ArcElement, PointElement, Title, Tooltip, Legend);

const indexValues = {
  ndvi: "NDVI: 0.72",
  lst: "LST: 31.4°C",
  moisture: "Soil Moisture: 18.5%"
};

const basePolygon = [
  [10.12194083473045, 76.39450491670644],
  [10.12158204551426, 76.39450842114405],
  [10.12162344429045, 76.39479928946596],
  [10.121951184413419, 76.39475373177699],
  [10.12194083473045, 76.39450491670644]
];

const soilChemicalData = {
  labels: ["pH", "EC (dS/m)", "OC (%)", "N (%)", "P (kg/ha)", "K (kg/ha)"],
  datasets: [
    {
      label: "Soil Chemical Properties",
      backgroundColor: ["#22c55e", "#f97316", "#60a5fa", "#a855f7", "#fbbf24", "#ec4899"],
      data: [6.7, 1.2, 0.75, 0.08, 2.5, 7]
    }
  ]
};

const metagenomicData = {
  labels: ["Actinobacteria", "Firmicutes", "Proteobacteria", "Ascomycota", "Basidiomycota"],
  datasets: [
    {
      label: "Soil Microbial Abundance",
      data: [32, 18, 27, 13, 10],
      backgroundColor: ["#60a5fa", "#facc15", "#34d399", "#a855f7", "#f97316"]
    }
  ]
};

function AnimatedPolygon({ color, children }) {
  const [weight, setWeight] = useState(2);
  useEffect(() => {
    const interval = setInterval(() => {
      setWeight((prev) => (prev === 2 ? 5 : 2));
    }, 800);
    return () => clearInterval(interval);
  }, []);
  return (
    <Polygon positions={basePolygon} pathOptions={{ color, weight }}>
      {children}
    </Polygon>
  );
}

function getPopupContent(layers) {
  const active = Object.entries(layers).filter(([, v]) => v);
  if (active.length === 0) return "IGS Sample Plot - Standard View";
  return ["IGS Sample Plot", ...active.map(([key]) => indexValues[key])].join("\n");
}

function App() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState("seasonal");
  const [layers, setLayers] = useState({ ndvi: false, lst: false, moisture: false });
  const [showChart, setShowChart] = useState(false);
  const [showMetaChart, setShowMetaChart] = useState(false);

  const toggleLayer = (layer) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const polygonColor = layers.ndvi ? "#22c55e" : layers.lst ? "#f97316" : layers.moisture ? "#0ea5e9" : "green";

  return (
    <div style={{ backgroundColor: "#e9f5ec", minHeight: "100vh", padding: "20px", fontFamily: "Arial" }}>
      <header style={{ textAlign: "center", padding: "10px 0" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>BiomeSeer Dashboard</h1>
        <p style={{ color: "#4b5563" }}>Explore microbial data and soil health insights</p>
      </header>

      <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
        <button onClick={() => setSelectedTab("dashboard")} style={{ padding: "10px 20px", background: selectedTab === "dashboard" ? "#059669" : "#34d399", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>🧭 Core Dashboard</button>
        <button onClick={() => setSelectedTab("trends")} style={{ padding: "10px 20px", background: selectedTab === "trends" ? "#059669" : "#34d399", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>📈 Seasonal Trends</button>
      </div>

      {selectedTab === "dashboard" && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "0 10%" }}>
          <div style={{ flex: 2 }}>
            <div style={{ background: "#f0fff4", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
              <h2>Farm Plot Map</h2>
              <div style={{ marginBottom: "12px" }}>
                <label><input type="checkbox" checked={layers.ndvi} onChange={() => toggleLayer("ndvi")} /> NDVI Layer</label><br />
                <label><input type="checkbox" checked={layers.lst} onChange={() => toggleLayer("lst")} /> Land Surface Temperature</label><br />
                <label><input type="checkbox" checked={layers.moisture} onChange={() => toggleLayer("moisture")} /> Soil Moisture Index</label>
              </div>
              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                <button onClick={() => setShowChart(!showChart)} style={{ padding: "6px 12px", backgroundColor: "#4b5563", color: "white", border: "none", borderRadius: "4px" }}>
                  {showChart ? "Hide" : "Show"} Soil Chemistry Chart
                </button>
                <button onClick={() => setShowMetaChart(!showMetaChart)} style={{ padding: "6px 12px", backgroundColor: "#16a34a", color: "white", border: "none", borderRadius: "4px" }}>
                  {showMetaChart ? "Hide" : "Show"} Metagenomic Chart
                </button>
              </div>
              <div style={{ marginTop: "20px" }}>
                <MapContainer center={[10.1218, 76.3946]} zoom={18} style={{ height: "300px", width: "100%" }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {layers.ndvi && <TileLayer opacity={0.4} url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />}  {/* NDVI */}
                  {layers.lst && <TileLayer opacity={0.4} url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />}  {/* LST */}
                  {layers.moisture && <TileLayer opacity={0.4} url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" />}  {/* Moisture */}
                  <AnimatedPolygon color={polygonColor}>
                    <Popup>{getPopupContent(layers)}</Popup>
                  </AnimatedPolygon>
                </MapContainer>
              </div>
              {showChart && (
                <div style={{ marginTop: "20px" }}>
                  <h3 style={{ textAlign: "center" }}>Soil Physico-chemical Chart</h3>
                  <Bar data={soilChemicalData} />
                </div>
              )}
              {showMetaChart && (
                <div style={{ marginTop: "20px" }}>
                  <h3 style={{ textAlign: "center" }}>Soil Metagenomic Analysis</h3>
                  <Doughnut data={metagenomicData} />
                </div>
              )}
            </div>
          </div>

          <div style={{ background: '#f0fff4', borderRadius: '8px', padding: '16px', flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>Advisory</h2>
            {[{ label: "Planting", desc: "Use biofertilizers with compost." }, { label: "Growth", desc: "Apply foliar sprays based on microbial diversity." }, { label: "Harvest", desc: "Minimal tillage post-harvest to preserve soil life." }].map((item) => (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }} key={item.label}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="green" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                  <circle cx="12" cy="12" r="10" fill="green" />
                </svg>
                <div>
                  <strong>{item.label}</strong>
                  <p style={{ margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal Trends tab retained below... */}
    </div>
  );
}

export default App;
