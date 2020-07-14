import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isShowing, hide, toggleShowModal, modalInfo, verifyTransaction }) =>



isShowing ? ReactDOM.createPortal(
  <React.Fragment>
    <div className="modal-overlay"/>
    <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
      <div className="modal">
        <div className="modal-header">
          <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={toggleShowModal}>
        
           
           
            <span aria-hidden="true">&times;</span>
          </button>
       
        </div>
        <div className="flex-column-center">
        <div className="form-header-subtitle">
            Signature
          </div>
          <div className="conform-input">
            {modalInfo.signature}
          </div>

          <div className="form-header-subtitle">
            Sender
          </div>
          <div className="conform-input">
            {modalInfo.transaction.sender_public_key}
          </div>
          <div className="form-header-subtitle">
            Recipient
          </div>
          <div className="conform-input">
            {modalInfo.transaction.recipient_public_key}
          </div>
          <div className="form-header-subtitle">
            Header
          </div>
          <div className="conform-input">
            {modalInfo.transaction.messageheader}
          </div>
          <div className="form-header-subtitle">
            Message
          </div>
          <div className="conform-input">
            {modalInfo.transaction.messageheader}
          </div>
    
         <button  className = "form-send" type="button" onClick={() => verifyTransaction(modalInfo)}>Confirm</button>   
        
        </div>
      </div>
    </div>
  </React.Fragment>, document.body
) : null;

export default Modal;