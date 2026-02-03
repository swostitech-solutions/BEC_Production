import React from 'react'
import AdmRoll from '../../components/AdminTabs/AdminRoll/AdmRoll'


import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Roll = () => {
  return (
    <div>
      <Card style={{ width: "100%", height: "100%", overflowY: "auto",

      backgroundColor:"#F5F5DC"
        // backgroundColor:"#FFE4C4"
       }}>
        <CardContent>
          <Typography
            variant="h4"
            component="h6"
            sx={{ textAlign: "center" }}
          >
          Role
          </Typography>


      

          <AdmRoll/>
        </CardContent>
      </Card>
    </div>
  )
}

export default Roll