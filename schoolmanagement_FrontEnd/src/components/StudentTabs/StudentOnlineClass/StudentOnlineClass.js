import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Button, Modal } from "react-bootstrap";

const StudentOnlineClass = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleShowInstructions = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4 px-3 mt-3">
                <Button variant="danger" onClick={() => navigate("/student/dashboards")} style={{ width: "120px" }}>
                  Close
                </Button>
                <p
                  style={{
                    margin: 0,
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "700",
                    flex: 1,
                  }}
                >
                  STUDENT ONLINE CLASS SUMMARY
                </p>
                <div style={{ width: "120px" }}></div>
              </div>
              <br />
              <div className="row mt-3 mx-2">
                <div
                  className="col-12 custom-section-box"
                  style={{ minHeight: "150px", position: "relative" }}
                >
                  <Row className="justify-content-center" style={{ marginTop: "50px" }}>
                    <Col md={8}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{
                            color: "red",
                            fontWeight: "600",
                            fontSize: "16px",
                            margin: 0,
                          }}
                        >
                          Read Instructions Carefully before Joining the Online class
                        </p>
                        <Button
                          variant="danger"
                          size="sm"
                          style={{
                            marginRight: "217px",
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                          }}
                          onClick={handleShowInstructions}
                        >
                          Instructions
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  {/* Bottom-right note */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "20px",
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "500",
                    }}
                  >
                    Class Link will be enabled 5 minutes before the class.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Full Instruction Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        scrollable
      >
        <Modal.Header
          style={{
            justifyContent: "center",
            borderBottom: "1px solid #a36d2f",
            backgroundColor: "#fff6ec",
          }}
        >
          <Modal.Title style={{ fontWeight: "700", color: "#803d00", textAlign: "center" }}>
            IMPORTANT INSTRUCTIONS FOR PARENTS:
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: "#fff", fontSize: "16px", lineHeight: "1.8" }}>
          <div
            style={{
              border: "1px solid #a36d2f",
              padding: "20px",
              backgroundColor: "#fcfcfc",
            }}
          >
            <p><strong>Dear Parents,</strong></p>

            <p>(1) During this crucial time of Pandemic caused by COVID-19, the School has been providing <strong>EDUCATION</strong> to the students by adopting various means during this lockdown. We adopted various methods to educate our students, like:</p>

            <ul>
              <li>YOUTUBE LINKS (based on Lessons)</li>
              <li>CBSE ACTIVITIES</li>
              <li>G.K. ASSIGNMENTS</li>
              <li>EXERCISES</li>
              <li>POEM RECITATION (JUNIORS)</li>
              <li>TEACHING FORMATION OF LETTERS (JUNIORS)</li>
            </ul>

            <p>(2) In addition to all these, Parents of students studying in Classes 2nd to 11th are now to download a Teaching App on their Mobile phone for their ward.</p>
            <p>The Teaching App is called <strong>GOOGLE MEET / HANGOUTS MEET</strong> by Google<br />
              <em>(Kindly download the App today)</em>
            </p>
            <p>As confirmed by the Professionals and the Technical team supporting the School, this App is very safe and secure for users.</p>

            <p>(3) <strong>LINK FOR ONLINE CLASSES:</strong></p>
            <p>The School shall send you the LINK one day in advance for your ward to attend the ONLINE CLASSES.</p>
            <p>You are to LOGIN using the USER ID and PASSWORD already sent to you to access assignments.<br />
              You’ll receive the ONLINE CLASS link the same way.<br />
              The link will work only as per the scheduled class time.</p>

            <p><strong>VERY IMPORTANT:</strong> Make sure the LINK is clicked <strong>ON TIME</strong> to avoid inconvenience.<br />
              If late, your ward will miss the teacher’s lecture.</p>

            <p>(4) <strong>STUDY MATERIAL:</strong><br />
              Your ward should be ready with writing material (pen, pencil, paper, books, etc.).<br />
              It’s advised to sit on a chair with a table for proper setup.
            </p>

            <p>(5) <strong>OUTFIT / DRESS:</strong><br />
              Your ward should wear <strong>decent clothes</strong> during the class.
            </p>

            <p>(6) <strong>DISCIPLINE:</strong><br />
              Guide your ward to be disciplined and attentive.<br />
              Teachers may remove any student found disturbing the class.
            </p>

            <p>(7) <strong>ROOM:</strong><br />
              Room should be well-lit and noise-free to avoid distractions.
            </p>

            <p>(8) <strong>WHO IS TO ATTEND THE CLASS:</strong><br />
              These ONLINE classes are strictly for students only.<br />
              No other family member should attend.
            </p>

            <p>(9) <strong>CO-OPERATION:</strong><br />
              Parents are encouraged to equally support and coordinate with the School for their child’s learning.
            </p>

            <p style={{ textAlign: "center", fontWeight: "bold" }}>STAY SAFE. STAY HAPPY !!</p>
          </div>
        </Modal.Body>

        <Modal.Footer style={{ justifyContent: "center", backgroundColor: "#fff6ec" }}>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentOnlineClass;
