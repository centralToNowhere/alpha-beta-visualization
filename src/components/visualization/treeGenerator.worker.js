/* eslint-disable */
import Chessjs from 'chess.js';

const ChessGame = new Chessjs();
let overallProgress = 0

const postProgress = () => {
	self.postMessage({
		msg: 'progress',
		value: overallProgress.toFixed(2)
	});
}

const generateMoveTree = (tree, maxDepth) => {

	const getNodeProgress = (movesAmount, prevNodeProgress) => {
		if (prevNodeProgress !== 0) {
			return prevNodeProgress * 1 / movesAmount;
		}

		return 1 / movesAmount;
	};

	const postProgressThrottle1000 = (() => {
		let ready = true;

		return () => {
			if (ready) {
				postProgress();

				ready = false;
				setTimeout(() => {
					ready = true;
				}, 100);
			}
		}
	})();

	const visitNextNode = (depth, node, prevNodeProgress = 0) => {
		let turn, moves = [];

		depth++;

		if (depth === maxDepth) {
			overallProgress += prevNodeProgress;
			// evaluate();
			return;
		}

		if (depth <= 3) {
			postProgress();
		}

		turn = ChessGame.turn();
		moves = ChessGame.moves();

		moves.forEach((move, i) => {
			const newNode = {
				side: turn,
				move: move,
				children: []
			};

			node.children.push(newNode);
			ChessGame.move(move);
			visitNextNode(depth, newNode, getNodeProgress(moves.length, prevNodeProgress));
			ChessGame.undo();
		});

		depth--;
		return node;
	}

	return visitNextNode(0, tree);
}

self.onmessage = (event) => {
	if (event.data.msg === 'generate' && event.data.maxDepth > 0 && event.data.gameState) {
		if (ChessGame.load(event.data.gameState)) {
			overallProgress = 0;
			const moveTree = generateMoveTree({children: []}, event.data.maxDepth);

			self.postMessage({
				msg: 'moveTree',
				value: moveTree
			});
			postProgress();

			return;
		}

		throw new Error('game state is incorrect. Please check fen string');
	}
}
