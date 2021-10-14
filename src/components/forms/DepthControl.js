import React, {createRef, useState} from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormLabel from 'react-bootstrap/FormLabel';
import i18n from "../../i18n/ru";

const DepthControl = (props) => {
	const depthFormStyles = {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		flexWrap: "wrap"
	};

	const depthControlInputStyles = {
		width: 100,
		margin: ".5rem"
	};

	const depthControlLabelStyles = {
		margin: ".5rem",
		lineHeight: "31px",
		verticalAlign: "middle"
	}

	const depthControlErrorStyles = {
		color: "red",
		width: "100%",
		textAlign: "center"
	}

	return (
		<Form onSubmit={(e) => {e.preventDefault()}} style={depthFormStyles}>
			<FormLabel style={depthControlLabelStyles}>{i18n.SEARCH_DEPTH}</FormLabel>
			<FormControl as="input" size="sm" type="number" value={props.depth} isValid={props.isDepthValid} onChange={props.onDepthChange} style={depthControlInputStyles}/>
			{ !props.isDepthValid && (
				<div style={depthControlErrorStyles}>{i18n.INVALID_DEPTH}</div>
			)}
		</Form>
	)
}

export default DepthControl;