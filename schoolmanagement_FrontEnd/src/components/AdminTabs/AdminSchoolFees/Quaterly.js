import React from "react";
import {
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
  { id: 1, duration: "Quarter 1", quarter1: "10080", amount: 20000 },
  { id: 2, duration: "Quarter 2", quarter1: "8000", amount: 20000 },
  { id: 3, duration: "Quarter 3", quarter1: "12000", amount: 20000 },
  { id: 4, duration: "Quarter 4", quarter1: "5000", amount: 20000 },
];

 const handlePay = (data) =>{
  console.log(data)
 }

const Quaterly = ({highlightColor}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Duration</TableCell>
            <TableCell align="center">Total Amount Pay</TableCell>
            <TableCell align="center">Payment Options</TableCell>
            <TableCell align="center">Payment Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {durations.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.duration}
              </TableCell>
              <TableCell align="center">
                {row.amount < 4000 ? (
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
                ) : (
                  row.amount
                )}
              </TableCell>
              <TableCell align="center">
                {row.amount < 4000 ? (
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
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePay(row.amount)}
                  >
                    Pay
                  </Button>
                )}
              </TableCell>
              <TableCell align="center">
                {row.amount < 20000 ? "Unpaid" : "Paid"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default Quaterly;
