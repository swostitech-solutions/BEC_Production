
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInbox,
  faPaperPlane,
  faEdit,
  faShare,
  faTrash,
  faReply,
  faWindowMinimize,
  faWindowMaximize,
  faTimes,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Row, Col, Container } from "react-bootstrap";

import "./AdmStudentSendFeedback.css"; 

const StdFeedback = () => {
  // State variables
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [from, setFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [subject, setSubject] = useState("");
  const [textareaContent, setTextareaContent] = useState("");
  const [file, setFile] = useState(null);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [randomNames, setRandomNames] = useState([
    "John Doe",
    "Alice Smith",
    "Bob Johnson",
    "Emily Davis",
    "Michael Wilson",
    "Sarah Brown",
  ]);
  const [isModalMaximized, setIsModalMaximized] = useState(false);
  const [inboxClicked, setInboxClicked] = useState(true);
  const [selectedCardData, setSelectedCardData] = useState(null);

  // Modal handlers
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseMessageModal = () => setShowMessageModal(false);
  const handleShowMessageModal = () => setShowMessageModal(true);
  const handleCloseForwardModal = () => setShowForwardModal(false);
  const handleShowForwardModal = () => setShowForwardModal(true);

  // Event handlers
  const handleToChange = (selectedOption) => setSelectedTo(selectedOption);
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleSendMessage = () => {
    setIsMessageSent(true);
    // Additional logic to handle sending message
  };

  const handleCardClick = (name, subject, content) => {
    setSelectedCardData({ name, subject, content });
  };

  const handleReply = () => {
    setFrom("");
    setSelectedTo(selectedCardData.name);
    setSubject(`Re: ${selectedCardData.subject}`);
    setTextareaContent("");
    handleShowMessageModal();
  };

  const handleForward = () => {
    setFrom("");
    setSelectedTo("");
    setSubject(`Fwd: ${selectedCardData.subject}`);
    setTextareaContent("");
    handleShowForwardModal();
  };

  const handleMinimizeModal = () => {
    setIsModalMaximized(false);
  };

  const handleMaximizeModal = () => {
    setIsModalMaximized(!isModalMaximized);
  };

  const handleInboxClick = (sentClicked) => {
    setInboxClicked(!sentClicked);
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <Container fluid
    style={{backgroundColor:""}}>
      <div className="page">
        <div className="top-section">
          <div className="icon-container create-mail" onClick={handleShowModal}>
            <FontAwesomeIcon icon={faEdit} size="lg" />
            <span>Create Mail</span>
          </div>
          <hr className="divider" />
          <div
            className="icon-container"
            style={{
              backgroundColor: "#87CEEB",
              padding: "20px",
              borderRadius: "5px",
            }}
            onClick={() => handleInboxClick(true)}
          >
            <FontAwesomeIcon icon={faInbox} size="lg" />
            <span>Inbox</span>
          </div>
          <hr className="divider" />
          <div
            className="icon-container"
            style={{
              backgroundColor: "#87CEEB",
              padding: "20px",
              borderRadius: "5px",
            }}
            onClick={() => handleInboxClick(false)}
          >
            <FontAwesomeIcon icon={faPaperPlane} size="lg" />
            <span>Sent</span>
          </div>
          <hr className="divider" />
        </div>

        <div className="middle-section">
          <div className="middle-section-top">
            <h2>Message</h2>
          </div>
          {inboxClicked ? (
            <>
              {randomNames.map((name, index) => {
                const [firstName, lastName] = name.split(" ");
                return (
                  <div
                    key={index}
                    className="card-send-fdb"
                    onClick={() =>
                      handleCardClick(
                        name,
                        `Sample Subject ${index + 1}`,
                        `Sample content for ${name}`
                      )
                    }
                  >
                    <div className="card-content-send-fdb">
                      <div className="round-shape">
                        <span>{firstName.charAt(0)}</span>
                        {lastName && <span>{lastName.charAt(0)}</span>}
                      </div>
                      <div className="card-info">
                        <h5 className="card-title-send-fdb">{name}</h5>
                        <p className="card-date-send-fdb">April 11, 2024</p>
                      </div>
                    </div>
                    <div className="card-subject-send-fdb">
                      <a href="#">
                        <b>{`Sample Subject ${index + 1}`}</b> - Click to read
                        more
                      </a>
                    </div>
                    <div className="card-content">
                      <p>
                        <a href="#">Sample content...</a>
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {randomNames.map((name, index) => {
                const [firstName, lastName] = name.split(" ");
                return (
                  <div
                    key={index}
                    className="card-send-fdb"
                    onClick={() =>
                      handleCardClick(
                        name,
                        `Sample Subject ${index + 1}`,
                        `Sample content for ${name}`
                      )
                    }
                  >
                    <div className="card-content-send-fdb">
                      <div className="round-shape">
                        <span>{firstName.charAt(0)}</span>
                        {lastName && <span>{lastName.charAt(0)}</span>}
                      </div>
                      <div className="card-info">
                        <h5 className="card-title-send-fdb">{name}</h5>
                        <p className="card-date-send-fdb">April 11, 2024</p>
                      </div>
                    </div>
                    <div className="card-subject-send-fdb">
                      <a href="#">
                        <b>{`Sample Subject ${index + 1}`}</b> - Click to read
                        more
                      </a>
                    </div>
                    <div className="card-content">
                      <p>
                        <a href="#">Sample content...</a>
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="bottom-section">
          {selectedCardData && (
            <div className="bottom-card bottom-section-card">
              <div
                className="bottom-card-header"
                style={{ backgroundColor: "#87CEEB", width: "100%" }}
              >
                <div
                  className="background-color"
                  style={{ backgroundColor: "#87CEEB" }}
                >
                  <Row>
                    <Col>
                      <div style={{ float: "left" }}>
                        <strong>From:</strong> {selectedCardData.name}
                      </div>
                      <br />
                      <div style={{ float: "left" }}>
                        <strong>To:</strong> {selectedTo}
                      </div>
                      <br />
                      <div style={{ float: "left", position: "relative" }}>
                        <strong>Subject:</strong> {selectedCardData.subject}
                      </div>
                    </Col>
                    <Col style={{ marginLeft: "57%" }}>
                      <div>April 11, 2024</div>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row>
                    <Col md={12}>
                      <div className="d-flex justify-content-end align-items-left">
                        <FontAwesomeIcon
                          icon={faShare}
                          size="lg"
                          onClick={handleForward}
                        />
                        <span className="icon-spacing"></span>
                        <FontAwesomeIcon icon={faTrash} size="lg" />
                        <span className="icon-spacing"></span>
                        <FontAwesomeIcon
                          icon={faReply}
                          size="lg"
                          onClick={handleReply}
                        />
                      </div>
                    </Col>
                  </Row>
                  <hr />
                </div>
              </div>
              <Row>
                <Col md={12}>
                  <p>{selectedCardData.content}</p>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </div>

      {/* Main Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size={isModalMaximized ? "xl" : "lg"}
      >
        <Modal.Header>
          <div className="modal-header-left">
            <span>Message</span>
          </div>
          <div className="modal-header-right">
            <div>{currentDate}</div>
            <div className="modal-header-icons">
              <FontAwesomeIcon
                icon={faWindowMinimize}
                style={{ marginRight: "15px" }}
                onClick={handleMinimizeModal}
              />
              <FontAwesomeIcon
                icon={isModalMaximized ? faWindowMinimize : faWindowMaximize}
                onClick={handleMaximizeModal}
              />
              <FontAwesomeIcon
                icon={faTimes}
                style={{ marginRight: "15px" }}
                onClick={handleCloseModal}
              />
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-content-area-left">
            <label>From:</label>
            <input
              type="text"
              placeholder="John Doe"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="modal-content-area-left">
            <label>To:</label>
            <input
              type="text"
              value={selectedTo}
              onChange={(e) => setSelectedTo(e.target.value)}
            />
          </div>
          <div className="modal-content-area-left">
            <label>Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="modal-content-area-left">
            <label>Message:</label>
            <textarea
              placeholder="Type your message here..."
              value={textareaContent}
              onChange={(e) => setTextareaContent(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-content-area-left">
            <label>
              <FontAwesomeIcon icon={faFile} /> Attach File:
            </label>
            <input type="file" onChange={handleFileChange} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={isMessageSent}
          >
            {isMessageSent ? "Sent" : "Send"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Message Modal */}
      <Modal show={showMessageModal} onHide={handleCloseMessageModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-content-area-left">
            <label>From:</label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="modal-content-area-left">
            <label>To:</label>
            <input
              type="text"
              value={selectedTo}
              onChange={(e) => setSelectedTo(e.target.value)}
            />
          </div>
          <div className="modal-content-area-left">
            <label>Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="modal-content-area-left">
            <label>Message:</label>
            <textarea
              placeholder="Type your message here..."
              value={textareaContent}
              onChange={(e) => setTextareaContent(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-content-area-left">
            <label>
              <FontAwesomeIcon icon={faFile} /> Attach File:
            </label>
            <input type="file" onChange={handleFileChange} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMessageModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSendMessage}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Forward Modal */}
      <Modal show={showForwardModal} onHide={handleCloseForwardModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Forward</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-content-area-left">
            <label>From:</label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="modal-content-area-left">
            <label>To:</label>
            <input
              type="text"
              value={selectedTo}
              onChange={(e) => setSelectedTo(e.target.value)}
            />
          </div>
          <div className="modal-content-area-left">
            <label>Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="modal-content-area-left">
            <label>Message:</label>
            <textarea
              placeholder="Type your message here..."
              value={textareaContent}
              onChange={(e) => setTextareaContent(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-content-area-left">
            <label>
              <FontAwesomeIcon icon={faFile} /> Attach File:
            </label>
            <input type="file" onChange={handleFileChange} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseForwardModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSendMessage}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StdFeedback;