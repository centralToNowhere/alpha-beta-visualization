/* eslint import/no-webpack-loader-syntax: off */
import React, {useState, useEffect} from 'react';
import Chessboard from 'chessboardjsx';
import Chessjs from 'chess.js';
import ButtonsContainer from "../controls/ButtonsContainer";
import ProgressBar from 'react-bootstrap/ProgressBar';

import TreeGeneratorWorker from 'worker-loader!./treeGenerator.worker.js';

import './ProgressBar.scss'

export const game = new Chessjs();
let algorithm = 'minimax';

export const setAlgorithm = (algo) => {
	const algoList = ['minimax', 'alphaBeta'];

	if (algoList.indexOf(algo) !== -1) {
		algorithm = algo;
	} else {
		console.error(`Algorithm ${algo} is not supported`);
	}
}

export const getAlgorithm = () => {
	return algorithm;
}



const ChessBoard = () => {
	const [boardPosition, setBoardPosition] = useState({});
	const [moveTree, setMoveTree] = useState({ next: []});
	const [progressTreeGen, setProgressTreeGen] = useState(0);

	const maxDepth = 4;
	const treeGenerator = new TreeGeneratorWorker();

	const startTreeGenerator = () => {
		treeGenerator.postMessage({
			msg: 'generate',
			maxDepth: maxDepth
		});
	}

	useEffect(() => {
		treeGenerator.onmessage = (event) => {
			if (event && event.data) {
				if (event.data.msg === 'progress') {
					setProgressTreeGen(event.data.value);
					console.log(event.data.value);
				}

				if (event.data.msg === 'moveTree') {
					setMoveTree(event.data.value);
					console.log(event.data.value);
				}

				if (event.data.msg === 'log') {
					console.log(event.data.value);
				}
			}
		}
	});

	const chessBoardConfig = {
		"calcWidth": ({ screenWidth, screenHeight }) =>
			(screenWidth || screenHeight) < 550 ? 200 : 300,
		"position": boardPosition,
		"sparePieces": true,
		"dropOffBoard": "trash",
		"boardStyle": {
			"border": "5px solid black",
			"box-sizing": "content-box",
		},
		"getPosition": (position) => {
			setBoardPosition((prevPosition) => {
				game.clear();

				Object.entries(position).forEach((entry) => {
					game.put({type: entry[1][1].toLowerCase(), color: entry[1][0]}, entry[0]);
				});

				return position;
			});
		}
	}

	const buttons = [
		{
			text: 'Start',
			active: false,
			onClick: startTreeGenerator,
			style: {
				marginTop: '20px',
				width: '50%'
			}
		}
	];
	const progressBarStyles = {
		backgroundColor: "black"
	}

	return (
		<div>
			<Chessboard {...chessBoardConfig}/>
			<ProgressBar animated style={{display: progressTreeGen === 0 ? 'none' : null}} now={progressTreeGen}/>
			<ButtonsContainer buttons={buttons}/>
		</div>
	)
}

export default ChessBoard;