


import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Map, FileText, Info } from "lucide-react";
import { Bar, Line, Pie } from "react-chartjs-2";
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
    <div className="p-6 space-y-6 bg-[#f7fafc] font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/logo-biomeseer.png" alt="BiomeSeer Logo" className="h-10" />
          <h1 className="text-3xl font-bold text-green-800">BiomeSeer Dashboard</h1>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">Language</Button>
        </div>
      </div>

      {/* Tabs for navigation */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-4 bg-white rounded-md shadow">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="diversity">Microbial Diversity</TabsTrigger>
          <TabsTrigger value="beneficials">Beneficial Microbes</TabsTrigger>
          <TabsTrigger value="functions">Functional Insights</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="advisory">Advisory</TabsTrigger>
        </TabsList>

        {/* Microbial Diversity Page */}
        <TabsContent value="diversity">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-semibold text-green-700">Diversity Indices</h2>

              <div className="flex flex-wrap gap-4 mb-4">
                <select
                  className="border p-2 rounded"
                  value={selectedPlot}
                  onChange={(e) => setSelectedPlot(e.target.value)}
                >
                  {plotOptions.map((plot) => (
                    <option key={plot} value={plot}>{plot}</option>
                  ))}
                </select>
                <select
                  className="border p-2 rounded"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <Bar data={dynamicStackedBarData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
              </div>
              <div className="bg-white p-4 rounded shadow">
                <Line data={dynamicRarefactionData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
