/* eslint import/no-webpack-loader-syntax: off */
import React, {useState, useEffect} from 'react';
import Chessboard from 'chessboardjsx';
import Chessjs from 'chess.js';
import ButtonsContainer from "../controls/ButtonsContainer";
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';

import Worker from './treeGenerator.worker';

import './ProgressBar.scss'

let algorithm = 'minimax';
const ChessGame = new Chessjs();

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
	const treeGenerator = new Worker();

	const startTreeGenerator = () => {
		treeGenerator.postMessage({
			msg: 'generate',
			maxDepth: maxDepth,
			gameState: ChessGame.fen()
		});
	}

	useEffect(() => {
		treeGenerator.onmessage = (event) => {
			if (event && event.data) {
				if (event.data.msg === 'progress') {
					setProgressTreeGen(Number((event.data.value * 100).toFixed(0)));
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
				ChessGame.clear();

				Object.entries(position).forEach((entry) => {
					ChessGame.put({type: entry[1][1].toLowerCase(), color: entry[1][0]}, entry[0]);
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
		display: progressTreeGen === 0 ? 'none' : null,
		textAlign: "center"
	}

	return (
		<div>
			<Chessboard {...chessBoardConfig}/>
			<Container style={progressBarStyles}>
				<ProgressBar now={progressTreeGen}/>
				<h2>{progressTreeGen}%</h2>
			</Container>
			<ButtonsContainer buttons={buttons}/>
		</div>
	)
}

export default ChessBoard;