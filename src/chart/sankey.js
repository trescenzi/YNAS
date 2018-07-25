import {select, selectAll} from "d3-selection";
import * as sankey from 'd3-sankey';
import styles from './sankey.css';

const d3 = Object.assign({},
  {
    select,
    selectAll
  },
  sankey
);

const scheme = [
  "#88e99a",
  "#1d413b",
  "#a1def0",
  "#1d866d",
  "#2bfafe",
  "#1d7bc3",
  "#b1e632",
  "#39970e",
  "#dbe9a8",
  "#683c00",
  "#fbcab9",
  "#7a0a18",
  "#f17a74",
  "#260607",
  "#ff1c5d",
  "#f8e547",
  "#ba865c",
  "#f79302",
  "#fe5900",
  "#51f310"
];

function deltaX(d) {
  return d.x1 - d.x0;
}

function deltaY(d) {
  return d.y1 - d.y0;
}

export default function ({
  links,
  nodes,
  height,
  width,
  selector,
  nodeId = (node) => node.name,
}) {
  const margin = {top: 10, right: 10, bottom: 10, left: 10};

  const sdiagram = d3.sankey();
  sdiagram.nodes(nodes);
  sdiagram.links(links);
  sdiagram.nodeId(nodeId);
  sdiagram.size([width,height]);
  const graph = sdiagram();
  const link = d3.sankeyLinkHorizontal();

  const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.2)
    .selectAll("path")
    .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", link)
      .attr("stroke-width", (d) => d.width)

  const node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
          return "translate(" + d.x0 + "," + d.y0 + ")"; })
  node.append("rect")
      .attr("height", deltaY)
      .attr("width", sdiagram.nodeWidth())
      .style("fill", (d) => {
        return scheme[d.index % scheme.length];
      })
      .style("stroke", "grey")

  node.append("text")
    .attr("x", -6)
    .attr("y", (d) => deltaY(d) /2)
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("transform", null)
  .filter((d) => deltaY(d) > 0)
    .text((d) => d.name)
  .filter((d) => d.x0 < width / 4)
    .attr("x", 6 + sdiagram.nodeWidth())
    .attr("text-anchor", "start")
}
