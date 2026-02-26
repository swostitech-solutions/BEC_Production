import React from "react";
import AdmAddStudentTable from "../AdminAddStudent/AdmAddStudentTable";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const AdmAddStudent = () => {
  return (
    <div>
      <Card style={{ width: "100%", height: "100%", overflowY: "auto" }}>
        <CardContent>
          <Typography
            variant="h4"
            component="h6"
            sx={{ textAlign: "center" }}
          >
            Add Student
          </Typography>


      

          <AdmAddStudentTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdmAddStudent;
