import React, {useEffect, useState} from 'react';
import * as d3 from 'd3';
import rd3 from 'react-d3-library';
import './Tree.scss';

const RD3Component = rd3.Component;

const Tree = () => {
	const [treeDiv, setTreeDiv] = useState(null);
	const [treeData, setTreeData] = useState(
		{
			"value": null,
			"type": 'max',
			"children": [
				{
					"value": null,
					"type": 'min',
					"children": [
						{
							"value": 9,
							"type": 'max'
						},
						{
							"value": 7,
							"type": 'max'
						}
					]
				},
				{
					"value": null,
					"type": 'min',
					"children": [
						{
							"value": 6,
							"type": 'max',
						},
						{
							"value": null,
							"type": 'max',
							"children": [
								{
									"value": 3,
									"type": 'min',
								},
								{
									"value": 4,
									"type": 'min',
								}
							]
						},
						{
							"value": null,
							"type": 'max',
							"children": [
								{
									"value": 7,
									"type": 'min',
								},
								{
									"value": 9,
									"type": 'min',
								}
							]
						}
					]
				},
				{
					"value": null,
					"type": 'min',
					"children": [
						{
							"value": 8,
							"type": 'max',
						},
						{
							"value": 3,
							"type": 'max',
						}
					]
				}
			]
		}
	);

	const generateMarker = (d) => {
		let marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		d3.select(marker).attr('r', 15).attr('style', `fill:${d.data.type === 'max' ? '#fff' : '#000'};stroke:#609AAF;stroke-width:10`);

		return marker;
	}

	const generateTextValue = (d) => {
		const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

		d3.select(text)
			.style("text-anchor", "middle")
			.style("font-size", "1em")
			.style("stroke", d.data.type === 'min' ? "#fff" : "#000" )
			.style("dominant-baseline", "central")
			.text(d.data.value)

		return text;
	}

	useEffect(() => {
		const div = document.createElement('div');
		const svg = d3.select(div).attr('class', 'tree-container').append('svg');
		const screenWidth  = window.innerWidth || document.documentElement.clientWidth ||
			document.body.clientWidth;
		const basicWidth = 700;

		const width = screenWidth < basicWidth ? screenWidth : basicWidth;
		const margin = {top: 40, right: 0, bottom: 50, left: 0};
		const height = 400 - margin.top - margin.bottom;
		const root = d3.hierarchy(treeData);
		const tree = d3.tree()
			.size([width, height]);

		const nodes = tree(root);

		svg.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

		const g = svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		const link = g.selectAll(".link")
			.data( nodes.descendants().slice(1))
			.enter().append("path")
			.attr("class", "link")
			.attr("d", function(d) {
				return "M" + d.x + "," + d.y
					+ "C" + d.x + "," + (d.y + d.parent.y) / 2
					+ " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
					+ " " + d.parent.x + "," + d.parent.y;
			});

		const node = g.selectAll(".node")
			.data(nodes.descendants())
			.enter().append("g")
			.attr("class", function(d) {
				return "node" +
					(d.children ? " node--internal" : " node--leaf"); })
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")"; });

		node.append(generateMarker);
		node.append(generateTextValue);

		setTreeDiv(div);
	}, []);


	return (
		<RD3Component data={treeDiv}/>
	)
}

export default Tree;