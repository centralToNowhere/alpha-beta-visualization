import React from 'react';
import Container from "react-bootstrap/Container";
import ProgressBarBS from "react-bootstrap/ProgressBar";

import './ProgressBar.scss'

const ProgressBar = (props) => {

	return (
		<Container className="progress-container">
			<ProgressBarBS now={props.progressTreeGen}/>
			<h2>{props.progressTreeGen}%</h2>
		</Container>
	);
}

export default ProgressBar;