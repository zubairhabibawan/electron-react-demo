import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function BasicModal({data,closeModal,printInvoice}) {
    return (
        <>
            <Modal show={!!data.invoice_no} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Inovice Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {data && (
                        <div>
                            <p><strong>Invoice Number:</strong> {data.invoice_no}</p>
                            <p><strong>Amount:</strong> ${data.amount}</p>
                            <p><strong>Date:</strong> {data.date}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={printInvoice}>
                        Print
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default BasicModal;