
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

import "./SendFdb.css"; // Import CSS file for styling

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
  const [messages, setMessages] = useState([
    {
      name: "John Doe",
      subject: "Sample Subject 1",
      content: "Sample content for John Doe",
    },
    {
      name: "Alice Smith",
      subject: "Sample Subject 2",
      content: "Sample content for Alice Smith",
    },
    {
      name: "Bob Johnson",
      subject: "Sample Subject 3",
      content: "Sample content for Bob Johnson",
    },
    {
      name: "Emily Davis",
      subject: "Sample Subject 4",
      content: "Sample content for Emily Davis",
    },
    {
      name: "Michael Wilson",
      subject: "Sample Subject 5",
      content: "Sample content for Michael Wilson",
    },
    {
      name: "Sarah Brown",
      subject: "Sample Subject 6",
      content: "Sample content for Sarah Brown",
    },
  ]);
  const [isModalMaximized, setIsModalMaximized] = useState(false);
  const [view, setView] = useState("Inbox");
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

  const handleDelete = () => {
    setMessages(messages.filter((message) => message !== selectedCardData));
    setSelectedCardData(null);
  };

  const handleMinimizeModal = () => {
    setIsModalMaximized(false);
  };

  const handleMaximizeModal = () => {
    setIsModalMaximized(!isModalMaximized);
  };

  const handleInboxClick = (viewType) => {
    setView(viewType);
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <Container fluid style={{ backgroundColor: "" }}>
      <div className="page">
        <div className="top-section">
          <div className="icon-container create-mail" onClick={handleShowModal}>
            <FontAwesomeIcon icon={faEdit} size="lg" />
            <span>Create Message</span>
          </div>
          <hr className="divider" />
          <div
            className="icon-container"
            style={{
              backgroundColor: "#87CEEB",
              padding: "20px",
              borderRadius: "5px",
            }}
            onClick={() => handleInboxClick("Inbox")}
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
            onClick={() => handleInboxClick("Sent")}
          >
            <FontAwesomeIcon icon={faPaperPlane} size="lg" />
            <span>Sent</span>
          </div>
          <hr className="divider" />
        </div>

        <div className="middle-section">
          <div className="middle-section-top">
            <h2>{view}</h2>
          </div>
          {view === "Inbox" ? (
            <>
              {messages.map((message, index) => {
                const [firstName, lastName] = message.name.split(" ");
                return (
                  <div
                    key={index}
                    className="card-send-fdb"
                    onClick={() =>
                      handleCardClick(
                        message.name,
                        message.subject,
                        message.content
                      )
                    }
                  >
                    <div className="card-content-send-fdb">
                      <div className="round-shape">
                        <span>{firstName.charAt(0)}</span>
                        {lastName && <span>{lastName.charAt(0)}</span>}
                      </div>
                      <div className="card-info">
                        <h5 className="card-title-send-fdb">{message.name}</h5>
                        <p className="card-date-send-fdb">April 11, 2024</p>
                      </div>
                    </div>
                    <div className="card-subject-send-fdb">
                      <a href="#">
                        <b>{message.subject}</b> - Click to read more
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
              {messages.map((message, index) => {
                const [firstName, lastName] = message.name.split(" ");
                return (
                  <div
                    key={index}
                    className="card-send-fdb"
                    onClick={() =>
                      handleCardClick(
                        message.name,
                        message.subject,
                        message.content
                      )
                    }
                  >
                    <div className="card-content-send-fdb">
                      <div className="round-shape">
                        <span>{firstName.charAt(0)}</span>
                        {lastName && <span>{lastName.charAt(0)}</span>}
                      </div>
                      <div className="card-info">
                        <h5 className="card-title-send-fdb">{message.name}</h5>
                        <p className="card-date-send-fdb">April 11, 2024</p>
                      </div>
                    </div>
                    <div className="card-subject-send-fdb">
                      <a href="#">
                        <b>{message.subject}</b> - Click to read more
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
                        <FontAwesomeIcon
                          icon={faTrash}
                          size="lg"
                          onClick={handleDelete}
                        />
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









