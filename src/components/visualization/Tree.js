import React, {useEffect, useState} from 'react';
import * as d3 from 'd3';
import rd3 from 'react-d3-library';
import './Tree.scss';

const RD3Component = rd3.Component;

const Tree = (props) => {
	const [treeDiv, setTreeDiv] = useState(null);

	useEffect(() => {
		const screenWidth = window.innerWidth || document.documentElement.clientWidth ||
			document.body.clientWidth;
		const screenHeight = window.innerHeight || document.documentElement.clientHeight ||
			document.body.clientHeight;
		const height = screenHeight;
		const width = screenWidth;
		const diameter = (width > height ? height : width) * 0.99;
		const radius = diameter / 2;
		const duration = 750;
		const tree = d3.tree();

		tree.size([2 * Math.PI, radius]);

		function handleZoom(e) {
			const t = e.transform;
			const svg = d3.select(".tree-container > svg");
			const g = svg.select('.tree-container > svg > g')

			g.attr("transform", `translate(${t.x + width / 2},${t.y + height / 2}) scale(${t.k})`);
		}

		const updateTree = (treeRoot) => {
			const hierarchy = d3.hierarchy(treeRoot);
			const treeData = tree(hierarchy);
			const nodes = hierarchy.descendants();
			const links = treeData.links();

			const div = document.createElement('div');
			setTreeDiv(div);

			const svg = d3.select(div)
				.attr("class", "tree-container")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

			const g = svg.append("g")
				.attr("stroke-opacity", 0.4)
				.attr("stroke-width", 1.5)
				.attr("transform", "translate("+(width/2)+","+(height/2)+")")
				.style("transform-origin", "-50% -50% 0");

			const zoom = d3.zoom()
				.on('zoom', handleZoom)

			svg.call(zoom);

			const link = g.selectAll(".link")
				.data(links)

			const linkEnter = link.enter().append("path")
				.attr("class", "link")
				.attr("d", d3.linkRadial()
					.angle(d => d.x)
					.radius(d => d.y));

			link.transition()
				.duration(duration)
				.attr("d", d3.linkRadial()
					.angle(d => d.x)
					.radius(d => d.y));

			link.exit().transition()
				.duration(duration)
				.attr("d", d3.linkRadial()
					.angle(d => d.x)
					.radius(d => d.y))
				.remove();

			const node = g.selectAll("circle")
				.data(nodes);

			const nodeEnter = node.enter().append("g")

			nodeEnter.append("circle")
				.attr("r", 5)
				.attr("stroke", function (d) {
					return d.data.side === "w" || d.data.side === "b" ? "#000" : "#626E98";
				})
				.attr("fill", function (d) {
					return d.data.side === "w" ? "#fff" : ( d.data.side === "b" ? "#000" : "#626E98");
				})
				.attr("transform", function (d) { return "translate(" + d3.pointRadial(d.x, d.y) + ")"; });

			// nodeEnter.append("text")
			// 	.attr("x", 10)
			// 	.attr("dy", ".35em")
			// 	.attr("text-anchor", "start")
			// 	.text(function(d) { return d.data.move; })
			// 	.style("fill-opacity", 1e-6);
			//
			// const nodeUpdate = node.transition()
			// 	.duration(duration)
			// 	.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
			//
			// nodeUpdate.select("text")
			// 	.style("fill-opacity", 1)
			// 	.attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.data.move.length + 50)  + ")"; });
			//
			// const nodeExit = node.exit().transition()
			// 	.duration(duration)
			// 	.remove();
			//
			// nodeExit.select("circle")
			// 	.attr("r", 1e-6);
			//
			// nodeExit.select("text")
			// 	.style("fill-opacity", 1e-6);
			//
			// nodes.forEach(function(d) {
			// 	d.x0 = d.x;
			// 	d.y0 = d.y;
			// });
		};

		updateTree(props.moveTree);
	}, [props.moveTree]);

	useEffect(() => {
		requestAnimationFrame(() => {
			setTimeout(() => {
				props.setShowProgressBar(false);
			}, 0)
		})
	}, []);

	return (
		<RD3Component data={treeDiv}/>
	)
}

export default Tree;