import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import WorldMap from "./components/WorldMap"; // Missing import for WorldMap component
import { useEffect, useState } from "react";
import * as d3 from "d3"; // Missing d3 import

function App() {
  const [loading, setLoading] = useState(true);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  
  const [worldPopulation, setWorldPopulation] = useState(null);
  const [topography, setTopography] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let populationData = {};
        const [topographyData] = await Promise.all([
          d3.json(
            "https://res.cloudinary.com/tropicolx/raw/upload/v1/Building%20Interactive%20Data%20Visualizations%20with%20D3.js%20and%20React/world.geojson"
          ),
          d3.csv(
            "https://res.cloudinary.com/tropicolx/raw/upload/v1/Building%20Interactive%20Data%20Visualizations%20with%20D3.js%20and%20React/world_population.csv",
            (d) => {
              populationData = {
                ...populationData,
                [d.code]: +d.population,
              };
            }
          ),
        ]);
        
        // Process the topography data for the bar chart
        const processedBarChartData = topographyData.features
          .map((d) => ({
            country: d.properties.name,
            population: populationData[d.id] || 0,
          }))
          .sort((a, b) => b.population - a.population)
          .slice(0, 12);
        
        setBarChartData(processedBarChartData);
        setWorldPopulation(populationData);
        setTopography(topographyData);
        
        // Fetch data from the Flask server
        try {
          const response = await fetch("http://127.0.0.1:5000/data");
          const data = await response.json();
          
          // Only update pieChartData from Flask, as we already set barChartData
          setPieChartData(data.pieChartData);
        } catch (flaskError) {
          console.error("Error fetching data from Flask:", flaskError);
          // If Flask server is unavailable, we can still use the D3 data
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="wrapper">
        <h1>
          <span className="thin">World</span>
          <span className="bold">Population</span> Insights 2022
        </h1>
        <main className="main">
          <div className="grid">
            <div className="card stat-card">
              <h2>Total Population</h2>
              <span className="stat">7.95B</span>
            </div>
            <div className="card stat-card">
              <h2>Male Population</h2>
              <span className="stat">4B</span>
            </div>
            <div className="card stat-card">
              <h2>Female Population</h2>
              <span className="stat">3.95B</span>
            </div>
            <div className="card map-container">
              <h2>World Population by Country</h2>
              {worldPopulation && topography && (
                <WorldMap width={550} height={450} data={{ worldPopulation, topography }} />
              )}
            </div>
            <div className="card pie-chart-container">
              <h2>World Population by Religion</h2>
              {pieChartData.length > 0 && (
                <PieChart width={650} height={450} data={pieChartData} />
              )}
            </div>
            <div className="card bar-chart-container">
              <h2>Top Countries by Population (in millions)</h2>
              {barChartData.length > 0 && (
                <BarChart width={1248} height={500} data={barChartData} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
