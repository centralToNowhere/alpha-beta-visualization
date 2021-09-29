import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import './Controls.scss';

const Arrows = () => {

	return (
		<Container className="control-container">
			<Button variant="outline-secondary" className="control-btn">{"<--"}</Button>
			<Button variant="outline-secondary" className="control-btn">{"-->"}</Button>
		</Container>
	);
}

export default Arrows;