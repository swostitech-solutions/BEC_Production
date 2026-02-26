// import React from 'react';
// import { Navbar, Table } from 'react-bootstrap';

// const AdmUpcomingHollyday = () => {
//   const holidayList = [
//     { name: 'New Year\'s Day', date: 'January 1' },
//     { name: 'Independence Day', date: 'August 15' },
//     { name: 'Christmas Day', date: 'December 25' },
//     // Add more holidays as needed
//   ];

//   return (
//     <div>
//       <Navbar bg="primary" variant="dark" style={{ padding: '5px 10px' }}>
//         <Navbar.Brand>Upcoming Holidays</Navbar.Brand>
//       </Navbar>
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>Holiday</th>
//             <th>Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {holidayList.map((holiday, index) => (
//             <tr key={index}>
//               <td>{holiday.name}</td>
//               <td>{holiday.date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

// export default AdmUpcomingHollyday;

import React from 'react';
import { Navbar, Table, Card } from 'react-bootstrap';

const AdmUpcomingHollyday = () => {
  const generateRandomDate = () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = Math.floor(Math.random() * 28) + 1; // Random day between 1 and 28
    const month = monthNames[Math.floor(Math.random() * 12)]; // Random month
    return `${month} ${day}`;
  };

  const generateRandomHoliday = () => {
    const holidays = ['New Year\'s Day', 'Independence Day', 'Christmas Day', 'Thanksgiving Day', 'Labor Day', 'Memorial Day', 'Halloween', 'Easter Sunday', 'Valentine\'s Day', 'April Fools\' Day', 'St. Patrick\'s Day'];
    return holidays[Math.floor(Math.random() * holidays.length)];
  };

  const holidayList = Array.from({ length: 20 }, (_, index) => ({
    name: generateRandomHoliday(),
    date: generateRandomDate(),
  }));

  return (
    <div>
      <Navbar bg="primary" variant="dark" style={{ padding: '5px 10px' }}>
        <Navbar.Brand>Upcoming Holidays</Navbar.Brand>
      </Navbar>
      <div style={{ maxHeight: '310px', overflowY: 'auto' }}>
        {holidayList.map((holiday, index) => (
          <Card key={index} style={{ width: '24rem', margin: '10px' }}>
            <Card.Body>
              <Card.Title>{holiday.name}</Card.Title>
              <Card.Text>Date: {holiday.date}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdmUpcomingHollyday;
