import React, {useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainView.scss';
import ButtonsContainer from "../controls/ButtonsContainer";
import Arrows from "../controls/Arrows";
import Tree from "../visualization/Tree";
import ChessBoard from "../visualization/ChessBoard";

const MainView = () => {

	useEffect(() => {

	}, []);

	const chessBoardStyles = {
		"position": "fixed",
		"top": 20,
		"right": 20,
	};

	const navButtons = [
		{
			text: 'Minimax',
			active: true
		},
		{
			text: 'AlphaBeta',
			active: false
		}
	]

	return (
		<Container fluid className="viewer__container">
			<Row>
				<Col>
					<Container fluid className="viewer__title">
						<h2>Alpha-beta pruning visualization</h2>
					</Container>
				</Col>
			</Row>
			<Row>
				<Col>
					<Container className="viewer">
						<ButtonsContainer buttons={navButtons}/>
						<div style={chessBoardStyles}>
							<ChessBoard/>
						</div>
						<Tree/>
						<Arrows/>
					</Container>
				</Col>
			</Row>
		</Container>
	);
}

export default MainView;