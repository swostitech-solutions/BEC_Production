// // import React from 'react'
// import AdminAddStaffs from "../../components/AdminTabs/AdminAddStaff/AdminAddStaffs";

// function AdminAddStaffs () {
//   return (
//     <div>
//       <AdminAddStaffs />
//     </div>
//   );
// }

// export default AdminAddStaffs



import React from "react";
import AdmAddStaf from "../../components/AdminTabs/AdminAddStaff/AdmAddStaf";
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";

const AddStaffs = () => {
  return (
    <div>
     
      <CardContent>
      
      <Typography variant="h4" component="h6" sx={{ textAlign: 'center',
      //  fontWeight: 700 
       }}>
    Add Staff
  </Typography>
  <AdmAddStaf />
  </CardContent>
    </div>
  );
};

export default AddStaffs;
