



import React, { useState } from "react";
// import "./StdAssignment.css"; // Import your custom CSS file for styling
import { Container, Table, Form, Row, ListGroup } from "react-bootstrap"; // Import the required components from react-bootstrap
import ReactPaginate from "react-paginate"; // Import the react-paginate component
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Import the icons

const data = [
  {
    date: "10 Feb 2024",
    details:
      "LATE FEE FINE: Dear Parents, to AVOID PAYING LATE FEE FINE (Rs. 300), deposit Fee in ICICI Bank by the 10th date of every month THE VEDIC ERA",
  },
  {
    date: "09 Feb 2024",
    details:
      "LATE FEE FINE: Dear Parents, to AVOID PAYING LATE FEE FINE (Rs. 300), deposit Fee in ICICI Bank by the 10th date of every month THE VEDIC ERA",
  },
  {
    date: "08 Feb 2024",
    details:
      "LATE FEE FINE: Dear Parents, to AVOID PAYING LATE FEE FINE (Rs. 300), deposit Fee in ICICI Bank by the 10th date of every month THE VEDIC ERA",
  },
  {
    date: "05 Feb 2024",
    details:
      "LATE FEE FINE: Dear Parents, to AVOID PAYING LATE FEE FINE (Rs. 300), deposit Fee in ICICI Bank by the 10th date of every month THE VEDIC ERA",
  },
  {
    date: "10 Jan 2024",
    details:
      "LATE FEE FINE: Dear Parents, to AVOID PAYING LATE FEE FINE (Rs. 300), deposit Fee in ICICI Bank by the 10th date of every month THE VEDIC ERA",
  },
  {
    date: "09 Jan 2024",
    details:
      "LATE FEE FINE: Dear Parents, to AVOID PAYING LATE FEE FINE (Rs. 300), deposit Fee in ICICI Bank by the 10th date of every month THE VEDIC ERA",
  },
  {
    date: "08 Jan 2024",
    details:
      "LATE FEE FINE: Dear Parents, to AVOID PAYING LATE FEE FINE (Rs. 300), deposit Fee in ICICI Bank by the 10th date of every month THE VEDIC ERA",
  },
  {
    date: "09 Dec 2023",
    details:
      "LATE FEE FINE: Dear Parents, to AVOID PAYING LATE FEE FINE (Rs. 300), deposit Fee in ICICI Bank by the 10th date of every month THE VEDIC ERA",
  },
  {
    date: "08 Dec 2023",
    details:
      "LATE FEE FINE: Dear Parents, to AVOID PAYING LATE FEE FINE (Rs. 300), deposit Fee in ICICI Bank by the 10th date of every month THE VEDIC ERA",
  },
  {
    date: "07 Dec 2023",
    details:
      "LATE FEE FINE: Dear Parents, to AVOID PAYING LATE FEE FINE (Rs. 300), deposit Fee in ICICI Bank by the 10th date of every month THE VEDIC ERA",
  },
];

function Assignment() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState(""); // State for search text
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Sort data by date in descending order (most recent first)
  const sortedData = [...data].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const filteredData = sortedData.filter(
    (item) =>
      item.date.includes(searchText) ||
      item.details.toLowerCase().includes(searchText.toLowerCase())
  );

  const displayedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <Container style={{ border: "1px solid #ccc", backgroundColor: "#f0f0f0",width:"80%" }}>
      <Row>
        <ListGroup.Item
          className="list-group-heading-std-assignment"
          style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}
        >
          Circulars
        </ListGroup.Item>
        <Form className="std-assignment-form">
          <br />
          <Form.Group className="mb-3" style={{ border: "1px solid #000" }}>
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Row>
      <br />
      <Row>
        <Table
          striped
          bordered
          hover
          responsive
          className="custom-table-staff-take-attendance text-center"
        >
          <thead>
            <tr>
              <th
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#87CEEB",
                  border: "1px solid #000",
                }}
              >
                Date
              </th>
              <th
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#87CEEB",
                  border: "1px solid #000",
                }}
              >
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #000" }}>{item.date}</td>
                <td style={{ border: "1px solid #000" }}>{item.details}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>

      <ReactPaginate
        previousLabel={<FaArrowLeft />} // Use FaArrowLeft icon for Previous
        nextLabel={<FaArrowRight />} // Use FaArrowRight icon for Next
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination-std-assignment"}
        subContainerClassName={"pages pagination-std-assignment"}
        activeClassName={"active-std-assignment"}
      />
    </Container>
  );
}

export default Assignment;
