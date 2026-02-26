import React, { useState } from 'react';
import { Navbar, Col, Card, Table, Button } from 'react-bootstrap';

const AdmMyOfficeShift = () => {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockedOut, setClockedOut] = useState(false);
  const [clockInTime, setClockInTime] = useState('');
  const [clockOutTime, setClockOutTime] = useState('');

  const handleClockIn = () => {
    setClockedIn(true);
    setClockInTime(new Date().toLocaleTimeString());
  };

  const handleClockOut = () => {
    setClockedOut(true);
    setClockOutTime(new Date().toLocaleTimeString());
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" style={{ padding: '5px 10px' }}>
        <Navbar.Brand>My Office Shift</Navbar.Brand>
      </Navbar>
      <div style={{ maxHeight: '265px', overflowY: 'auto' }}>
        <Col xs={12} lg={9}>
          <Card className="mb-4" style={{ width: '100%' }}>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Shift</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Shift 11</td>
                    <td>9:00 AM to 6:00 PM</td>
                    <td>
                      {clockedOut
                        ? `Clocked Out at ${clockOutTime}`
                        : clockedIn
                        ? 'Present'
                        : 'Not Clocked In'}
                    </td>
                    <td>
                      <Button
                        variant="success"
                        onClick={handleClockIn}
                        disabled={clockedIn || clockedOut}
                      >
                        Clock In
                      </Button>{' '}
                      <Button
                        variant="danger"
                        onClick={handleClockOut}
                        disabled={!clockedIn || clockedOut}
                      >
                        Clock Out
                      </Button>
                    </td>
                  </tr>
                  {/* Add more shift rows as needed */}
                </tbody>
              </Table>
              {/* Show clock-in and clock-out times when clocked in and out */}
              {(clockInTime || clockOutTime) && (
                <ul className="mt-3">
                  {clockInTime && (
                    <li>
                      <strong>Clock-In Time:</strong> {clockInTime}
                    </li>
                  )}
                  {clockOutTime && (
                    <li>
                      <strong>Clock-Out Time:</strong> {clockOutTime}
                    </li>
                  )}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </div>
    </>
  );
};

export default AdmMyOfficeShift;
