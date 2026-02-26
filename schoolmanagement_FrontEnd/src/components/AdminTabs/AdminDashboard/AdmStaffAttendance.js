// import React from 'react';
// import { Navbar, Dropdown, Button } from 'react-bootstrap';
// import { useHistory } from 'react-router-dom';
// import { PieChart } from '@mui/x-charts/PieChart';

// const AdmStudentAttendance = () => {
//   const handleViewClick = () => {
//     window.location.href = '/admin/staff-view-student-attendance';
//   };

//   return (
//     <div>
//       <Navbar bg="primary" variant="dark" style={{ padding: '5px 10px' }}>
//         <Navbar.Brand>Staff Attendance</Navbar.Brand>
//         {/* <Navbar.Text>Class 1</Navbar.Text>
//         <Navbar.Text>Subject 1</Navbar.Text> */}
//       </Navbar>
//       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
      
//       </div>
//       <PieChart
//         series={[
//           {
//             data: [
//               { id: 0, value: 100, label: 'Present' },
//               { id: 1, value: 15, label: 'Absent' },
//             ],
//           },
//         ]}
//         width={330}
//         height={200}
//       />
//       <div style={{ display: 'flex', justifyContent: 'flex-end',marginTop:'20px'}}>
//         <Button variant="primary" onClick={handleViewClick}>View</Button>
//       </div>
//     </div>
//   );
// };

// export default AdmStudentAttendance;




import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import { Navbar } from 'react-bootstrap';

const pieParams = { height: 200, margin: { right: 5 } };
const palette = ['red', 'green'];

export default function PieColor() {
  return (
    <div>
        <Navbar bg="primary" variant="dark" style={{ padding: '5px 10px' }}>
        <Navbar.Brand>Staff Attendance</Navbar.Brand>
     
      </Navbar>
    <Stack direction="row" width="100%" textAlign="center" spacing={2}>
      
      <Box flexGrow={1}>
        {/* <Typography>Palette</Typography> */}
        <PieChart
          colors={palette}
          series={[{ data: [{ value: 10 }, { value: 15 }]}]}
          {...pieParams}
        />
      </Box>
      
    </Stack>
    </div>
  );
}

