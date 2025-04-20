// /components/PieChart.jsx
import * as d3 from "d3";
import { useState } from "react";

const offsetX = 70;

const PieChart = ({ width, height, data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track the hovered segment
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState({
    ...data[0],
    x: 0,
    y: 0,
  });

  // Calculate the total value
  const totalValue = data.reduce((sum, religion) => sum + religion.value, 0);

  // Calculate the percentage for each religion and format the result
  let percentageData = {};
  data.forEach((religion) => {
    percentageData[religion.name] = (
      (religion.value / totalValue) *
      100
    ).toFixed(1);
  });

  // Create the color scale
  const color = d3
    .scaleOrdinal(d3.schemeTableau10)
    .domain(data.map((d) => d.name));

  // Create the pie layout and arc generator.
  const pie = d3
    .pie()
    .value((d) => d.value);

  const outerRadius = Math.min(width - 2, height - 2) / 2 - offsetX;

  const arc = d3.arc().innerRadius(0).outerRadius(outerRadius);

  // A separate arc generator for the hovered segment with increased radius
  const arcHover = d3.arc().innerRadius(0).outerRadius(outerRadius + 10);

  // A separate arc generator for labels.
  const labelRadius = arc.outerRadius()() * 0.75;
  const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

  const arcs = pie(data);

  return (
    <div className="container">
      <svg
        width={width}
        height={height}
        viewBox={`${-width / 2 + offsetX} ${-height / 2} ${width} ${height}`}
        className="viz"
      >
        {arcs.map((d, i) => (
          <g
            key={d.data.name}
            stroke="white"
            onMouseOver={() => {
              setTooltipVisible(true);
              setHoveredIndex(i); // Set the hovered index
            }}
            onMouseLeave={() => {
              setTooltipVisible(false);
              setHoveredIndex(null); // Reset the hovered index
            }}
            onMouseMove={() => {
              setTooltipData({
                ...data[i],
                x: arcLabel.centroid(d)[0],
                y: arcLabel.centroid(d)[1],
              });
            }}
            style={{
              transition: "transform 0.3s ease",
              transform: hoveredIndex === i ? "scale(1.1)" : "scale(1)",
            }}
          >
            <path
              d={hoveredIndex === i ? arcHover(d) : arc(d)} // Use larger radius for hovered segment
              fill={color(data[i].name)}
              style={{ transition: "0.25s ease" }}
            />
            <text
              x={arcLabel.centroid(d)[0]}
              y={arcLabel.centroid(d)[1]}
              textAnchor="middle"
              stroke="none"
              fontSize={16}
              strokeWidth={0}
              fill="white"
            >
              {percentageData[d.data.name] > 5 ? `${percentageData[d.data.name]}%` : ""}
            </text>
          </g>
        ))}

        {/* Legend */}
        <g>
          {data.map((d, i) => {
            const x = outerRadius + 14;
            const y = -height / 2 + i * 20 + 20;

            return (
              <g key={d.name}>
                <rect x={x} y={y} width={20} height={15} fill={color(d.name)} />
                <text
                  x={x}
                  y={y}
                  dx={25}
                  fontSize={14}
                  alignmentBaseline="hanging"
                >
                  {d.name}
                </text>
              </g>
            );
          })}
        </g>
        <g
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          className={`tooltip ${tooltipVisible ? "visible" : ""}`}
        >
          <rect
            width={200}
            height={60}
            x={tooltipData.x - 10}
            y={tooltipData.y + 10}
            stroke="#cccccc"
            strokeWidth="1"
            fill="#ffffff8f"
            rx={10}
            ry={10}
          ></rect>
          <g>
            <text
              textAnchor="start"
              x={tooltipData.x}
              y={tooltipData.y + 35}
              fontSize={16}
            >
              {tooltipData.name}
            </text>
          </g>
          <g>
            <text
              textAnchor="start"
              x={tooltipData.x}
              y={tooltipData.y + 55}
              fontSize={16}
              fontWeight="bold"
            >
              {tooltipData.value.toLocaleString()}
              {` (${percentageData[tooltipData.name]}%)`}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default PieChart;