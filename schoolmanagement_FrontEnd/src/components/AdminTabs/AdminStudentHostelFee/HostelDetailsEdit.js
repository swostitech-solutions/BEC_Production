import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
const HostelEdit = ({
  show,
  handleClose,
  studentData,
  transportDetails,
  routes,
  onUpdate,
}) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState("");
  const [amount, setAmount] = useState("");
  const [transportAvailed, setTransportAvailed] = useState(false);
  const [hostelAvailed, setHostelAvailed] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [route, setRoute] = useState([]);
  const [months, setMonths] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [selectedPickups, setSelectedPickups] = useState(null);
  const [amounts, setAmounts] = useState("");
  const [monthStatus, setMonthStatus] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const token = localStorage.getItem("accessToken");
  const orgId = sessionStorage.getItem("organization_id") || 1;
  const branchId = sessionStorage.getItem("branch_id") || 1;
  const [hostelList, setHostelList] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [floorList, setFloorList] = useState([]);
  const [roomTypeList, setRoomTypeList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [bedList, setBedList] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedSemesters, setSelectedSemesters] = useState([]); // checkbox list

  useEffect(() => {
    if (!transportDetails) return;

    const matchedRoute = (routes || []).find(
      (route) => route.value === transportDetails.routeId
    );
    setSelectedRoute(matchedRoute || null);
  }, [routes, transportDetails]);

  // -----------------------------------------
  // LOAD HOSTEL LIST
  // -----------------------------------------
  useEffect(() => {
    if (!show) return;
    const fetchHostels = async () => {
      // const res = await fetch(
      //   `${ApiUrl.apiurl}HOSTEL/GetHostelList/?organization_id=${orgId}&branch_id=${branchId}`
      // );
      const res = await fetch(
        `${ApiUrl.apiurl}HOSTEL/GetHostelList/?organization_id=${orgId}&branch_id=${branchId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅
          },
        }
      );

      const data = await res.json();
      setHostelList(
        data.map((item) => ({
          value: item.id,
          label: item.hostel_name,
        }))
      );
    };
    fetchHostels();
  }, [show]);

  // -----------------------------------------
  // LOAD BLOCKS WHEN HOSTEL SELECTED
  // -----------------------------------------
  useEffect(() => {
    if (!selectedHostel) return;

    const fetchBlocks = async () => {
      // const res = await fetch(
      //   `${ApiUrl.apiurl}HOSTEL/GetHostelBlockList/?organization_id=${orgId}&branch_id=${branchId}&hostel_id=${selectedHostel.value}`
      // );
      const res = await fetch(
        `${ApiUrl.apiurl}HOSTEL/GetHostelBlockList/?organization_id=${orgId}&branch_id=${branchId}&hostel_id=${selectedHostel.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅
          },
        }
      );

      const data = await res.json();
      setBlockList(
        data.map((item) => ({
          value: item.id,
          label: item.block_name,
        }))
      );
    };
    fetchBlocks();
  }, [selectedHostel]);

  // -----------------------------------------
  // LOAD FLOORS WHEN BLOCK SELECTED
  // -----------------------------------------
  useEffect(() => {
    if (!selectedHostel || !selectedBlock) return;

    const fetchFloors = async () => {
      // const res = await fetch(
      //   `${ApiUrl.apiurl}HOSTEL/GetHostelBlockFloorList/?organization_id=${orgId}&branch_id=${branchId}&hostel_id=${selectedHostel.value}&hostel_block_id=${selectedBlock.value}`
      // );
      const res = await fetch(
        `${ApiUrl.apiurl}HOSTEL/GetHostelBlockFloorList/?organization_id=${orgId}&branch_id=${branchId}&hostel_id=${selectedHostel.value}&hostel_block_id=${selectedBlock.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅
          },
        }
      );

      const data = await res.json();
      setFloorList(
        data.map((floor) => ({
          value: floor.id,
          label: floor.floor_number,
        }))
      );
    };
    fetchFloors();
  }, [selectedBlock]);

  // -----------------------------------------
  // LOAD ROOM TYPES
  // -----------------------------------------
  useEffect(() => {
    if (!selectedHostel) return;

    const fetchRoomTypes = async () => {
      // const res = await fetch(
      //   `${ApiUrl.apiurl}HOSTEL/GetHostelRoomTypeList/?organization_id=${orgId}&branch_id=${branchId}&hostel_id=${selectedHostel.value}`
      // );
      const res = await fetch(
        `${ApiUrl.apiurl}HOSTEL/GetHostelRoomTypeList/?organization_id=${orgId}&branch_id=${branchId}&hostel_id=${selectedHostel.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅
          },
        }
      );

      const data = await res.json();
      setRoomTypeList(
        data.map((item) => ({
          value: item.id,
          label: item.room_type,
        }))
      );
    };
    fetchRoomTypes();
  }, [selectedHostel]);

  // -----------------------------------------
  // LOAD ROOM NUMBERS WHEN ALL 4 SELECTED
  // -----------------------------------------
  useEffect(() => {
    if (
      !selectedHostel ||
      !selectedBlock ||
      !selectedFloor ||
      !selectedRoomType
    )
      return;

    const fetchRooms = async () => {
      // const res = await fetch(
      //   `${ApiUrl.apiurl}HOSTEL/GetHostelRoomList/?organization_id=${orgId}&branch_id=${branchId}&hostel_id=${selectedHostel.value}&hostel_block_id=${selectedBlock.value}&hostel_block_floor_id=${selectedFloor.value}&room_type_id=${selectedRoomType.value}`
      // );
      const res = await fetch(
        `${ApiUrl.apiurl}HOSTEL/GetHostelRoomList/?organization_id=${orgId}&branch_id=${branchId}&hostel_id=${selectedHostel.value}&hostel_block_id=${selectedBlock.value}&hostel_block_floor_id=${selectedFloor.value}&room_type_id=${selectedRoomType.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅
          },
        }
      );

      const data = await res.json();
      setRoomList(
        data.map((item) => ({
          value: item.id,
          label: item.room_number,
        }))
      );
    };
    fetchRooms();
  }, [selectedFloor, selectedRoomType]);

  // -----------------------------------------
  // LOAD BED LIST WHEN ROOM SELECTED
  // -----------------------------------------
  useEffect(() => {
    if (
      !selectedHostel ||
      !selectedBlock ||
      !selectedFloor ||
      !selectedRoomType ||
      !selectedRoom
    )
      return;

    const fetchBeds = async () => {
      // const res = await fetch(
      //   `${ApiUrl.apiurl}HOSTEL/GetHostelRoomBedList/?organization_id=${orgId}&branch_id=${branchId}&hostel_id=${selectedHostel.value}&hostel_block_id=${selectedBlock.value}&hostel_block_floor_id=${selectedFloor.value}&room_type_id=${selectedRoomType.value}&room_id=${selectedRoom.value}`
      // );
      const res = await fetch(
        `${ApiUrl.apiurl}HOSTEL/GetHostelRoomBedList/?organization_id=${orgId}&branch_id=${branchId}&hostel_id=${selectedHostel.value}&hostel_block_id=${selectedBlock.value}&hostel_block_floor_id=${selectedFloor.value}&room_type_id=${selectedRoomType.value}&room_id=${selectedRoom.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅
          },
        }
      );

      const data = await res.json();
      setBedList(
        data.map((item) => ({
          value: item.id,
          label: item.bed_number,
          isAvailable: item.is_available,
        }))
      );
    };
    fetchBeds();
  }, [selectedRoom]);

  // ----------------------------------------------------
  // PREFILL DROPDOWN VALUES SAFELY WHEN EDIT BUTTON CLICKED
  // ----------------------------------------------------
  useEffect(() => {
    if (!show) return; // Do nothing when modal closed

    if (transportDetails) {
      setSelectedHostel(
        transportDetails.hostel_id
          ? {
            value: transportDetails.hostel_id,
            label: transportDetails.hostel_name,
          }
          : null
      );

      setSelectedBlock(
        transportDetails.block_id
          ? {
            value: transportDetails.block_id,
            label: transportDetails.block_name,
          }
          : null
      );

      setSelectedFloor(
        transportDetails.floor_id
          ? {
            value: transportDetails.floor_id,
            label: transportDetails.floor_number,
          }
          : null
      );

      setSelectedRoomType(
        transportDetails.room_type_id
          ? {
            value: transportDetails.room_type_id,
            label: transportDetails.room_type,
          }
          : null
      );

      setSelectedRoom(
        transportDetails.room_id
          ? {
            value: transportDetails.room_id,
            label: transportDetails.room_number,
          }
          : null
      );

      setSelectedBed(
        transportDetails.bed_id
          ? {
            value: transportDetails.bed_id,
            label: transportDetails.bed_number,
          }
          : null
      );
    } else {
      // If API returns no data → allow user to choose manually
      setSelectedHostel(null);
      setSelectedBlock(null);
      setSelectedFloor(null);
      setSelectedRoomType(null);
      setSelectedRoom(null);
      setSelectedBed(null);
    }
  }, [transportDetails, show]);

  // Fetch Assign Semester to student
  // useEffect(() => {
  //   if (!show) return;

  //   const fetchFeeAppliedData = async () => {
  //     try {
  //       const token = localStorage.getItem("accessToken");
  //       const orgId = sessionStorage.getItem("organization_id");
  //       const branchId = sessionStorage.getItem("branch_id");
  //       const studentId = studentData?.student_id;

  //       const res = await fetch(
  //         `${ApiUrl.apiurl}HOSTEL/HostelDetailsRetrieveByStudent/?organization_id=${orgId}&branch_id=${branchId}&student_id=${studentId}`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       const result = await res.json();
  //       console.log("API Result:", result);

  //       if (
  //         result?.data &&
  //         result.data?.fee_applied_from_id
  //       ) {
  //         // 🌟 Set the existing semesters from API
  //         setSelectedSemesters(result.data.fee_applied_from_id);
  //       } else {
  //         setSelectedSemesters([]);
  //       }

  //     } catch (error) {
  //       console.error("Error fetching fee_applied_from_id:", error);
  //     }
  //   };

  //   fetchFeeAppliedData();
  // }, [show, studentData]);

  const handleMonthToggle = (id) => {
    setMonthStatus((prev) =>
      prev.map((month) =>
        month.id === id && !month.disabled
          ? { ...month, checked: !month.checked }
          : month
      )
    );
  };

  const handleSave = async () => {
    const studentId = studentData?.student_id;
    if (!studentId) {
      alert("Student ID is missing!");
      return;
    }

    const userId = sessionStorage.getItem("userId") || 1;
    const organizationId = sessionStorage.getItem("organization_id") || 1;
    const branchId = sessionStorage.getItem("branch_id") || 1;

    const selectedSemesterIds = monthStatus
      .filter((month) => month.checked)
      .map((month) => month.id);
    console.log(selectedSemesters);

    const payload = {
      organization_id: Number(organizationId),
      branch_id: Number(branchId),
      hostel_id: selectedHostel?.value || null,
      hostel_block_id: selectedBlock?.value || null,
      hostel_block_floor_id: selectedFloor?.value || null,
      room_type_id: selectedRoomType?.value || null,
      room_id: selectedRoom?.value || null,
      bed_id: selectedBed?.value || null,
      choice_semester_ids: selectedSemesterIds,
      // choice_semester_ids: selectedSemesters || [],
      student_id: Number(studentId),
      hostel_avail: true,
      created_by: Number(userId),
    };

    console.log("Payload to send:", payload);

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}HOSTEL/StudentHostelAssign/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to assign hostel");

      alert("Hostel assigned successfully!");
      handleClose();
      onUpdate();
    } catch (error) {
      console.error("Error assigning hostel:", error);
      alert("Error while saving hostel details.");
    }
  };

  const handleClearFields = () => {
    setSelectedHostel(null);
    setSelectedBlock(null);
    setSelectedFloor(null);
    setSelectedRoomType(null);
    setSelectedRoom(null);
    setSelectedBed(null);

    setBlockList([]);
    setFloorList([]);
    setRoomTypeList([]);
    setRoomList([]);
    setBedList([]);
  };

  const currentMonth = new Date().getMonth() + 1;

  if (!studentData) {
    console.log("No Student Data Found");
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Hostel Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "75vh", overflowY: "auto" }}>
        {/* Search Section */}
        <div className="container-fluid">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              type="button"
              className="btn btn-secondary"
              onClick={handleClearFields}
            >
              Clear
            </Button>
            <Button
              onClick={handleClose}
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Close
            </Button>
          </div>
          {/* Student Info */}
          <div className="border p-3 rounded mt-3">
            <div className="border p-3 rounded">
              <div className="row g-2">
                <div className="col-md-4">
                  <label className="form-label">Student Name</label>
                  <input
                    type="text"
                    className="form-control detail"
                    value={studentData.student_name || ""}
                    readOnly
                    disabled
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Admission No</label>
                  <input
                    type="text"
                    className="form-control detail"
                    value={
                      transportDetails?.admission_no ||
                      studentData.college_admission_no
                    }
                    readOnly
                    disabled
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Student Barcode</label>
                  <input
                    type="text"
                    className="form-control detail"
                    value={studentData.barcode || ""}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="row g-2 mt-2">
                <div className="col-md-4">
                  <label className="form-label">Father Name</label>
                  <input
                    type="text"
                    className="form-control detail"
                    value={transportDetails?.father_name || ""}
                    readOnly
                    disabled
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Mother Name</label>
                  <input
                    type="text"
                    className="form-control detail"
                    value={transportDetails?.mother_name || ""}
                    readOnly
                    disabled
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Registration No</label>
                  <input
                    type="text"
                    className="form-control detail"
                    value={studentData.registration_no || ""}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <br></br>
            {/* Transport Details */}
            <div className="border p-3 rounded">
              <div className="row g-2">
                <div className="col-md-4">
                  <label className="form-label">Hostel Name</label>
                  <Select
                    options={hostelList}
                    value={selectedHostel}
                    onChange={setSelectedHostel}
                    placeholder="Select Hostel"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Hostel Block</label>
                  <Select
                    options={blockList}
                    value={selectedBlock}
                    onChange={setSelectedBlock}
                    placeholder="Select Block"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Floor No</label>
                  <Select
                    options={floorList}
                    value={selectedFloor}
                    onChange={setSelectedFloor}
                    placeholder="Select Floor"
                  />
                </div>
              </div>
              <div className="row g-2 mt-2">
                <div className="col-md-4">
                  <label className="form-label">Room Type</label>
                  <Select
                    options={roomTypeList}
                    value={selectedRoomType}
                    onChange={setSelectedRoomType}
                    placeholder="Select Room Type"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Room No</label>
                  <Select
                    options={roomList}
                    value={selectedRoom}
                    onChange={setSelectedRoom}
                    placeholder="Select Room"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Bed No</label>
                  <Select
                    options={bedList}
                    value={selectedBed}
                    onChange={setSelectedBed}
                    placeholder="Select Bed"
                    getOptionLabel={(opt) =>
                      opt.isAvailable
                        ? opt.label
                        : `${opt.label} (Not Available)`
                    }
                    isOptionDisabled={(opt) => opt.isAvailable === false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default HostelEdit;
