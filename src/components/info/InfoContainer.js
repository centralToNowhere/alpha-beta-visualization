import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import './InfoContainer.scss';

const InfoContainer = (props) => {
	return (
		<Container style={props.style} className="info-container">
			<span>
				{props.text}
			</span>
			{props.children}
		</Container>
	);
}

export default InfoContainer;