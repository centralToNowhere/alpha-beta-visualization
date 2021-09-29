/* eslint-disable */
import {game} from './ChessBoard';

self.importScripts('.')

self.onmessage = (event) => {
	if (event.data.msg === 'generate' && event.data.maxDepth > 0) {
		const moveTree = generateMoveTree({next: []}, event.data.maxDepth);
		self.postMessage({
			msg: 'moveTree',
			value: moveTree
		});
	}
}

const generateMoveTree = (tree, maxDepth) => {
	const fn = (depth, node, currentProgress = 0) => {
		let turn, moves = [];

		depth++;

		if (depth === maxDepth) {
			// evaluate();
			return;
		}

		turn = game.turn();
		moves = game.moves();
		moves.forEach((move, i) => {
			let progress = currentProgress * (i + 1) / moves.length;

			self.postMessage({
				msg: 'progress',
				value: progress
			});

			const newNode = {
				side: turn,
				move: move,
				next: []
			};

			node.next.push(newNode);
			game.move(move);
			fn(depth, newNode, progress);
			game.undo();
		});

		depth--;

		return node;
	}
}