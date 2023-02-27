import * as d3 from "d3";
import React, { useEffect } from "react";

const colors = ['yellow','orange','red','pink','purple']

export const LineChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = React.useState(null);
  const [color,setColor] = React.useState('red');
  const margin = { top: 40, right: 80, bottom: 60, left: 50 };
  const width = 960 - margin.left - margin.right;
  const height = 280 - margin.top - margin.bottom;

  const yMaxValue = d3.max(data, (d) => d.y);
  const xMaxValue = d3.max(data, (d) => d.x);
  const xMinValue = d3.min(data, (d) => d.x);

  const getX = d3
    .scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([0, width]);

  const getY = d3.scaleLinear().domain([0, yMaxValue]).range([height, 0]);

  const getXAxis = (ref) => {
    const xAxis = d3.axisBottom(getX).tickSize(-height).tickPadding(5);
    d3.select(ref).call(xAxis);
  };

  const getYAxis = (ref) => {
    const yAxis = d3.axisLeft(getY).tickSize(-width).tickPadding(5);
    d3.select(ref).call(yAxis);
  };

  const linePath = d3
    .line()
    .x((d) => getX(d.x))
    .y((d) => getY(d.y))
    .curve(d3.curveMonotoneX)(data);

  const handleMouseMove = (index, item) => {
    const svg = d3.select("#svg1");

    if (index === activeIndex) {
      return;
    } else {
      svg
        .append("line")
        .attr("id", "targetLine")
        .style("stroke", "green")
        .style("stroke-width", 3)
        .attr("x1", getX(item.x))
        .attr("y1", getY(item.y))
        .attr("x2", getX(item.x))
        .attr("y2", getY(+item.target));

      svg
        .append("line")
        .attr("id", "predictionLine")
        .style("stroke", "blue")
        .style("stroke-width", 3)
        .attr("x1", getX(item.x))
        .attr("y1", getY(item.y))
        .attr("x2", getX(item.x))
        .attr("y2", getY(item.prediction));

      setActiveIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
    d3.select("#targetLine").remove();
    d3.select("#predictionLine").remove();
  };

  const changeColor = () => {
   const index = colors.findIndex((elem)=>elem === color);
   if(index < colors.length){
    setColor(colors[index+1])
   }
   if(index === colors.length-1){
    setColor(colors[0])
   }
  };

  useEffect(()=>{
    d3.select(this).style('fill',color)
  },[color])

  return (
    <div
      className="wrapper"
      style={{
        height: "100vh",
        padding: 100,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <svg
        id="svg1"
        viewBox={`0 0 ${width + margin.left + margin.right} 
                          ${height + margin.top + margin.bottom}`}
      >
        <g ref={getYAxis} color={color} />
        <g ref={getXAxis} color={color} transform={`translate(0,${height})`} />

        <path strokeWidth={3} fill="none" stroke={color} d={linePath} />

        {data.map((item, index) => {
          return (
            <g key={index}>
              <text
                x={getX(item.x)}
                y={getY(item.y) - 20}
              >
                {index === activeIndex ? item.y : ""}
              </text>

              <circle
                onMouseMove={() => handleMouseMove(index, item)}
                onMouseLeave={handleMouseLeave}
                cx={getX(item.x)}
                cy={getY(item.y)}
                r={index === activeIndex ? 6 : 4}
                fill={color}
                strokeWidth={index === activeIndex ? 2 : 0}
                stroke="#fff"
              />
            </g>
          );
        })}
      </svg>
      <button onClick={()=>changeColor()}>Change color</button>
    </div>
  );
};
