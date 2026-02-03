import React from 'react';
import { Navbar, Card } from 'react-bootstrap';

const AdmUpcomingEmployeeBirthday = () => {
  const birthdays = [
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
    { id: 1, name: 'John Doe', date: 'May 5th'},
  
    // Add more birthdays here
  ];

  return (
    <div>
      <Navbar bg="primary" variant="dark" style={{ padding: '5px 10px' }}>
        <Navbar.Brand>Upcoming Employee Birthday</Navbar.Brand>
      </Navbar>
      <div style={{ height: '265px', overflowY: 'auto' }}>
        {birthdays.map((birthday) => (
          <Card key={birthday.id} style={{ width: '610px', margin: '10px', textAlign: 'center', border: '1px solid blue', height: '60%' }}>
            <Card.Body>
              <Card.Title>{birthday.name}</Card.Title>
              <Card.Text>{birthday.date}</Card.Text>
              {/* <Card.Text>{birthday.message}</Card.Text> */}
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdmUpcomingEmployeeBirthday;
