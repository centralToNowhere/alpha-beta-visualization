import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import './Controls.scss';

const ButtonsContainer = (props) => {
	return (
		<Container className="control-container">
			{props.buttons.map((button) => {
				return (<Button onClick={button.onClick} active={button.active} variant={button.variant || "outline-dark"} className="control-btn" style={button.style}>{button.text}</Button>);
			})}
		</Container>
	)
}

export default ButtonsContainer;