import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import AdmBookSearch from '../AdminBookSearch/AdmBookSearch'; 

const SelectStudentModal = ({ isVisible, onClose }) => {
  return (
    <>
      <style>
        {`
          .modal-backdrop.show {
            background-color: transparent;
          }
          // .custom-modal .modal-content {
          //   background-color: white; 
          //   border-radius: 0.5rem;
          // }
          .custom-modal .modal-dialog {
            max-width: 80%; 
            width: auto; 
          }
          .custom-modal .modal-dialog .modal-content {
            padding:0.1rem;
          }
        `}
      </style>
      <Modal
        show={isVisible}
        onHide={onClose}
        size="lg" 
        centered
        backdrop="static"
        className="custom-modal" 
      >
        <Modal.Header closeButton>
        
        </Modal.Header>
        <Modal.Body>
          <AdmBookSearch />
        </Modal.Body>
        <Modal.Footer>
       
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SelectStudentModal;
