/* eslint import/no-webpack-loader-syntax: off */
import React, {useState, useEffect} from 'react';
import Chessboard from 'chessboardjsx';
import Chessjs from 'chess.js';

import Worker from './treeGenerator.worker';

const ChessGame = new Chessjs();
const treeGenerator = new Worker();

const ChessBoard = (props) => {
	const [boardPosition, setBoardPosition] = useState('');
	const depth = props.depth;

	useEffect(() => {
		ChessGame.clear();
		setBoardPosition(ChessGame.fen());
	}, []);

	useEffect(() => {
		const startTreeGenerator = () => {
			props.setMoveTree({ children: []});
			props.setShowTree(false);
			props.setProgressTreeGen(0);

			treeGenerator.postMessage({
				msg: 'generate',
				maxDepth: Number(depth),
				gameState: boardPosition
			});
		};

		const workerOnMessage = (event) => {
			if (event && event.data) {
				if (event.data.msg === 'progress') {
					props.setProgressTreeGen(Number((event.data.value * 100).toFixed(0)));
				}

				if (event.data.msg === 'moveTree') {
					props.setMoveTree(event.data.value);
					props.setShowTree(true);
					props.onSearchEnd();
					console.log(event.data.value);
				}

				if (event.data.msg === 'log') {
					console.log(event.data.value);
				}
			}
		};

		props.onSearchStart(startTreeGenerator);

		treeGenerator.addEventListener('message', workerOnMessage);

		return () => {
			treeGenerator.removeEventListener('message', workerOnMessage);
		};

	}, [props, depth, boardPosition]);

	const chessBoardConfig = {
		"calcWidth": ({ screenWidth, screenHeight }) =>
			(screenWidth || screenHeight) < 550 ? 200 : 300,
		"position": boardPosition,
		"sparePieces": true,
		"dropOffBoard": "trash",
		"boardStyle": {
			border: "1px solid black",
			boxSizing: "content-box"
		},
		"getPosition": (position) => {
			setBoardPosition((prevPosition) => {
				ChessGame.clear();

				Object.entries(position).forEach((entry) => {
					ChessGame.put({type: entry[1][1].toLowerCase(), color: entry[1][0]}, entry[0]);
				});

				return ChessGame.fen();
			});
		}
	}

	const chessBoardStyles = {
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	}

	return (
		<div style={chessBoardStyles}>
			<Chessboard {...chessBoardConfig}/>
		</div>
	);
}

export default ChessBoard;