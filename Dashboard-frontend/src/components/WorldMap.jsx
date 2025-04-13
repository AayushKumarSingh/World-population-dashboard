import * as d3 from "d3";
import { useRef, useState, useEffect } from "react";
import Legend from "./Legend";

const WorldMap = ({ width, height, data }) => {
    const worldPopulation = data.worldPopulation;
    const topography = data.topography;

    // Map and projection
    const path = d3.geoPath();
    const projection = d3
        .geoMercator()
        .scale(85)
        .center([0, 30])
        .translate([width / 2, height / 2]);

    const chartRef = useRef(null);
    const gRef = useRef(null); // Reference for the group element

    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState({
        name: "",
        population: "",
        x: 0,
        y: 0,
    });

    const pathGenerator = path.projection(projection);

    // Color scale
    const colorScale = d3
        .scaleThreshold()
        .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
        .range(d3.schemeBlues[7]);

    useEffect(() => {
        const svg = d3.select(chartRef.current);
        const g = d3.select(gRef.current);

        const zoom = d3
            .zoom()
            .scaleExtent([1, 8])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom);
    }, []);

    return (
        <div className="container">
            <svg
                className="viz"
                ref={chartRef}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
            >
                <g ref={gRef} className="topography">
                    {topography.features.map((d) => (
                        <path
                            key={d.id}
                            d={pathGenerator(d)}
                            fill={colorScale(worldPopulation[d.id] || 0)}
                            stroke="#FFFFFF"
                            strokeWidth={0.3}
                            onMouseEnter={() => {
                                setTooltipVisible(true);
                            }}
                            onMouseLeave={() => {
                                setTooltipVisible(false);
                            }}
                            onMouseMove={(event) => {
                                const population = (
                                    worldPopulation[d.id] || "N/A"
                                ).toLocaleString();

                                const [x, y] = d3.pointer(
                                    event,
                                    chartRef.current
                                );

                                setTooltipData({
                                    name: d.properties.name,
                                    population,
                                    left: x - 30,
                                    top: y - 80,
                                });
                            }}
                        />
                    ))}
                </g>

                {/* Legend */}
                <g className="legend" transform="translate(10,10)">
                    <Legend
                        color={colorScale}
                        width={height / 1.25}
                        tickFormat={d3.format("~s")}
                    />
                </g>
            </svg>
            {tooltipData && (
                <div
                    className={`tooltip ${tooltipVisible ? "visible" : ""}`}
                    style={{
                        left: tooltipData.left,
                        top: tooltipData.top,
                    }}
                >
                    {tooltipData.name}
                    <br />
                    {tooltipData.population}
                </div>
            )}
        </div>
    );
};

export default WorldMap;
