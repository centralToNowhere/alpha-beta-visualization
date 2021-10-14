import React from 'react';
import ModalBS from 'react-bootstrap/Modal';
import './Modal.scss';

const Modal = (props) => {
	return (
		<ModalBS centered={false} dialogClassName={"custom-modal"} show={props.show} onHide={props.onHide}>
			<ModalBS.Header closeButton>
				<ModalBS.Title>{props.msg}</ModalBS.Title>
			</ModalBS.Header>
			<ModalBS.Body style={{padding: 0}}>{props.children}</ModalBS.Body>
		</ModalBS>
	)
}

export default Modal;