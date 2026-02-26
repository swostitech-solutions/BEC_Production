import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from '../../../ApiUrl';

function StdHostelDetails() {
  const navigate = useNavigate();
  const [hostelDetails, setHostelDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleClose = () => {
    navigate("/student/dashboards");
  };

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        setError(null);

        // Get required IDs from storage
        const studentId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
        const organizationId = sessionStorage.getItem('organization_id') || localStorage.getItem('orgId');
        const branchId = sessionStorage.getItem('branch_id') || localStorage.getItem('branchId');
        const token = localStorage.getItem('accessToken');

        if (!studentId || !organizationId || !branchId) {
          setError('Required information not found. Please login again.');
          return;
        }

        if (!token) {
          setError('Authentication token not found. Please login again.');
          return;
        }

        // Build query parameters
        const queryParams = new URLSearchParams({
          organization_id: organizationId,
          branch_id: branchId,
          student_id: studentId,
        });

        const apiUrl = `${ApiUrl.apiurl}HOSTEL/HostelDetailsRetrieveByStudent/?${queryParams.toString()}`;
        console.log('Fetching hostel details from:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        console.log('Hostel details response:', result);

        if (!response.ok) {
          // Handle 404 or other error responses
          if (response.status === 404) {
            // Use the API's error message if available, otherwise use a default message
            const errorMessage = result.message || 'Hostel details not found for this student.';
            setError(errorMessage.includes('not found')
              ? 'You are not currently assigned to any hostel. Please contact the administration for hostel assignment.'
              : errorMessage);
            return;
          }
          // For other HTTP errors, use the API message or a generic error
          setError(result.message || `Failed to fetch hostel details. Status: ${response.status}`);
          return;
        }

        if (result.message === 'success' && result.data) {
          setHostelDetails(result.data);
        } else {
          setError(result.message || 'Failed to fetch hostel details.');
        }
      } catch (err) {
        console.error('Error fetching hostel details:', err);
        setError(err.message || 'An error occurred while fetching hostel details.');
      }
    };

    fetchHostelDetails();
  }, []);

  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card p-0">
              <div className="card-body">
                <div className="row mb-3 mt-3 mx-0" style={{ alignItems: "center" }}>
                  <div className="col-12 d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ width: "120px", marginRight: "15px" }}
                      onClick={handleClose}
                    >
                      Close
                    </button>
                    <p
                      style={{
                        marginBottom: '0px',
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: '700',
                        flex: 1,
                      }}
                    >
                      HOSTEL DETAILS
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div style={{
                    textAlign: 'center',
                    backgroundColor: 'white',
                    color: 'black',
                    border: '1px solid #dee2e6',
                    borderRadius: '0.25rem',
                    padding: '1rem 1.25rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '18px', marginBottom: '15px', color: 'black', fontWeight: '500' }}>
                      <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                      No Hostel Assignment
                    </div>
                    <p style={{ fontSize: '16px', marginBottom: '10px', color: 'black' }}>{error}</p>
                    <hr style={{ borderColor: '#dee2e6', marginTop: '1rem', marginBottom: '1rem' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hostelDetails) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card p-0">
              <div className="card-body">
                <div className="row mb-3 mt-3 mx-0" style={{ alignItems: "center" }}>
                  <div className="col-12 d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ width: "120px", marginRight: "15px" }}
                      onClick={handleClose}
                    >
                      Close
                    </button>
                    <p
                      style={{
                        marginBottom: '0px',
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: '700',
                        flex: 1,
                      }}
                    >
                      HOSTEL DETAILS
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div style={{
                    textAlign: 'center',
                    backgroundColor: 'white',
                    color: 'black',
                    border: '1px solid #dee2e6',
                    borderRadius: '0.25rem',
                    padding: '1rem 1.25rem',
                    marginBottom: '1rem'
                  }}>
                    No hostel details available.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <div className="row mb-3 mt-3 mx-0" style={{ alignItems: "center" }}>
                <div className="col-12 d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ width: "120px", marginRight: "15px" }}
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  <p
                    style={{
                      marginBottom: '0px',
                      textAlign: 'center',
                      fontSize: '20px',
                      fontWeight: '700',
                      flex: 1,
                    }}
                  >
                    HOSTEL DETAILS
                  </p>
                </div>
              </div>

              <div className="col-12 mt-4">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-primary">
                      <tr>
                        <th>Sr.No</th>
                        <th>Student Name</th>
                        <th>Admission No</th>
                        <th>College Admission No</th>
                        <th>Barcode</th>
                        <th>Father Name</th>
                        <th>Mother Name</th>
                        <th>Hostel Name</th>
                        <th>Block Name</th>
                        <th>Floor Number</th>
                        <th>Room Type</th>
                        <th>Room Number</th>
                        <th>Bed Number</th>
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: "#ffffff" }}>
                      {hostelDetails ? (
                        <tr style={{ backgroundColor: "#ffffff" }}>
                          <td>1</td>
                          <td>{hostelDetails.student_name || "N/A"}</td>
                          <td>{hostelDetails.admission_no || "N/A"}</td>
                          <td>{hostelDetails.college_admission_no || "N/A"}</td>
                          <td>{hostelDetails.barcode || "N/A"}</td>
                          <td>{hostelDetails.father_name || "N/A"}</td>
                          <td>{hostelDetails.mother_name || "N/A"}</td>
                          <td>{hostelDetails.hostel_name || "N/A"}</td>
                          <td>{hostelDetails.block_name || "N/A"}</td>
                          <td>{hostelDetails.floor_number || "N/A"}</td>
                          <td>{hostelDetails.room_type || "N/A"}</td>
                          <td>{hostelDetails.room_number || "N/A"}</td>
                          <td>{hostelDetails.bed_number || "N/A"}</td>
                        </tr>
                      ) : (
                        <tr style={{ backgroundColor: "#ffffff" }}>
                          <td colSpan="13" className="text-center">
                            No hostel details available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StdHostelDetails;
