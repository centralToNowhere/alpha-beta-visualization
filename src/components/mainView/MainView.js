import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainView.scss';
import ButtonsContainer from "../controls/ButtonsContainer";
import Arrows from "../controls/Arrows";
import Tree from "../visualization/Tree";
import ChessBoard from "../visualization/ChessBoard";
import InfoContainer from "../info/InfoContainer";
import i18n from "../../i18n/ru";
import DepthControl from "../forms/DepthControl";
import ProgressBar from "../info/ProgressBar";
import Modal from '../modal/Modal';
import {mainViewColor} from "./ColorScheme";

const MainView = () => {
	const [algo, setAlgo] = useState('minimax');
	const [depth, setDepth] = useState(3);
	const [progressTreeGen, setProgressTreeGen] = useState(0);
	const [moveTree, setMoveTree] = useState({ children: []});
	const [showProgressBar, setShowProgressBar] = useState(false);
	const [showTree, setShowTree] = useState(false);
	const [showTreeModal, setShowTreeModal] = useState(false);
	const [modalMsg, setModalMsg] = useState('');

	const switchAlgo = (newAlgo) => {
		setAlgo(newAlgo);
	};

	const isSearchConditionsFulfilled = () => {
		return validateDepth(depth) && algo;
	}

	const validateDepth = (depth) => {
		return !Number.isNaN(parseInt(depth)) && depth < 6 && depth >= 1;
	};

	const onDepthChange = (e) => {
		setDepth(e.target.value);
	};

	/**
	 * This functions will be overwritten by child component's methods
	 * Initial values
	 */
	let onSearchStart = function () {};

	useEffect(() => {

	}, []);

	const algoTranslationsList = {
		minimax: i18n.MINIMAX,
		alphaBeta: i18n.ALPHA_BETA
	};

	const getAlgoButtonsConfig = () => {
		const algoList = ['minimax', 'alphaBeta'];

		return algoList.map((name) => {
			return {
				text: algoTranslationsList[name],
				active: algo === name,
				onClick: switchAlgo.bind(null, name),
				style: {
					background: algo === name ? mainViewColor : "initial"
				}
			}
		});
	};

	const onSearchEnd = () => {
		setModalMsg(algoTranslationsList[algo]);
	}

	return (
		<Container fluid className="viewer__container">
			<Row>
				<Col>
					<Container fluid className="viewer__title">
						<h2 style={{padding: "1rem"}}>{i18n.ALPHA_BETA_ALGORITHM_VISUALIZATION}</h2>
					</Container>
				</Col>
			</Row>
			<Row>
				<Col>
					<Container className="viewer">
						<InfoContainer text={i18n.FIRST_SCREEN_DESCRIPTION}/>
						<ButtonsContainer buttons={getAlgoButtonsConfig()}/>
						<DepthControl
							isDepthValid={validateDepth(depth)}
							depth={depth}
							onDepthChange={onDepthChange}
						/>
						<ChessBoard
							algo={algo}
							depth={depth}
							setMoveTree={setMoveTree}
							onSearchStart={(fn) => {onSearchStart = fn} }
							onSearchEnd={onSearchEnd}
							setShowTree={setShowTree}
							setProgressTreeGen={setProgressTreeGen}
						/>
						<Container className="control-container">
							<Button
								onClick={() => {
									onSearchStart();
									setShowTreeModal(true);
									setShowProgressBar(true);
									setModalMsg(i18n.GENERATING_TREE_MSG);
								}}
								active={isSearchConditionsFulfilled()}
								disabled={!isSearchConditionsFulfilled()}
								variant={"outline-dark"}
								className="control-btn"
								style={{
									background: mainViewColor,
									marginTop: "1rem",
								}}
							>{i18n.START_BUTTON}</Button>
						</Container>
						<Modal
							show={showTreeModal}
							onHide={() => {setShowTreeModal(false)}}
							msg={modalMsg}
						>
							{ showTree &&
								<Tree moveTree={moveTree} setShowProgressBar={setShowProgressBar}/>
							}
							{/*{ !showProgressBar &&*/}
							{/*	<Arrows/>*/}
							{/*}*/}
							{ showProgressBar &&
								<ProgressBar progressTreeGen={progressTreeGen}/>
							}
						</Modal>
					</Container>
				</Col>
			</Row>
		</Container>
	);
}

export default MainView;