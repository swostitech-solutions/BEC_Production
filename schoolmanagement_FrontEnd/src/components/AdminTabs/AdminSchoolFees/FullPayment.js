import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
const durations = [
  {
    id: 1,
    duration: "Duration 1",
    quarter1: "10000",
    quarter2: "10000",
    quarter3: "10000",
    quarter4: "10000",
    amount: 40000,
  },
  // Add more durations as needed
];
const FullPayment = ({highlightColor}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Duration</TableCell>
            <TableCell align="center">Quarter 1</TableCell>
            <TableCell align="center">Quarter 2</TableCell>
            <TableCell align="center">Quarter 3</TableCell>
            <TableCell align="center">Quarter 4</TableCell>
            <TableCell align="center">Total Amount Pay</TableCell>
            <TableCell align="center">Payment Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {durations.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.duration}
              </TableCell>
              <TableCell align="center">{row.quarter1}</TableCell>
              <TableCell align="center">{row.quarter2}</TableCell>
              <TableCell align="center">{row.quarter3}</TableCell>
              <TableCell align="center">{row.quarter4}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor:
                      row.amount === 4000 ? highlightColor : "#00FF00",
                  }}
                >
                  {row.amount}
                </Button>
              </TableCell>
              <TableCell align="center">
                <Button variant="contained" color="primary">
                  Pay
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default FullPayment;
