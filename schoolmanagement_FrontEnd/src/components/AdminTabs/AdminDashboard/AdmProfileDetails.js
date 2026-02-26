import React from "react";
import { Col, Card, Navbar, Row } from "react-bootstrap";
import Container from 'react-bootstrap/Container';

const AdmPersonalDetails = () => {
  return (
    <div>
      <Navbar bg="primary" variant="dark" style={{ padding: "5px 10px" }}>
        <Navbar.Brand>Profile</Navbar.Brand>
      </Navbar>
      <Container>
      <Row>
        <Col>
        <Card >
            <Card.Img variant="top" src="/img/Man photo.avif" />
          </Card>
        </Col>
        <Col>
        <div style={{ height: "200px", overflow: "auto" }}>
            <Card>
              <Card.Body>
                <Card.Title>Shamahari Das</Card.Title>
                <Card.Text>
                  Gender: Male <br />
                  Email: example@example.com <br />
                  Address: Your Address <br />
                  Phone: 1234567890
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
      
    </Container>
    </div>
  );
};

export default AdmPersonalDetails;
