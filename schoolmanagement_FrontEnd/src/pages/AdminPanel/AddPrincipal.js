import React from 'react'
import AdmAddPrincipal  from "../../components/AdminTabs/AdminAddPrincipal/AdmAddPrincipal"
import Typography from '@mui/material/Typography';
const AddPrincipal = () => {
  return (
    <div>
      
       

        <Typography
            variant="h4"
            component="h6"
            sx={{ textAlign: "center", marginTop: "10px" }}
          >
           Add Principal
          </Typography>
          <AdmAddPrincipal />
    </div>
  )
}

export default AddPrincipal