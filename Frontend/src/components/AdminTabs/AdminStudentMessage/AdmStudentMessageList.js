import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { fetchMessageTypes } from "../../hooks/fetchMessageTypes ";
import { fetchInitiatedByList } from "../../hooks/fetchInitiatedByList";
import { ApiUrl } from "../../../ApiUrl";
import Select from "react-select";

function SelectedStudentTable({}) {
  const [isDisabled, setIsDisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [messageTypes, setMessageTypes] = useState([]);
  const [initiatedByList, setInitiatedByList] = useState([]);
  const [selectedMessageType, setSelectedMessageType] = useState("");
  const [fullStudentData, setFullStudentData] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filterState, setFilterState] = useState({
    schoolAdmissionNo: "",
    barcode: "",
  });
  const itemsPerPage = 10;
  const [formState, setFormState] = useState({
    messageType: "",
    messageDate: "",
    smsTo: "B",
    initiatedBy: "",
    initiationRemarks: "",
    messageTime: "",
    schoolAdmissionNo: "",
    barcode: "",
    message: "",
  });
  const [tableData, setTableData] = useState({
    initiatedBy: "",
    initiationRemarks: "",
    message: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const initiatedByRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchInitiatedByList();
      setInitiatedByList(data);
    };
    fetchData();
  }, []);

  const initiatedByOptions = initiatedByList.map((item) => ({
    value: item.id,
    label: item.initiated_by_description,
  }));

  // Custom handler for React Select
  const handleInitiatedByChange = (selectedOption) => {
    const selectedValue = selectedOption?.value || "";
    setFormState((prevState) => ({
      ...prevState,
      initiatedBy: selectedValue,
    }));
  };
  const handleOpenModal = () => setShowModal(true);
  const handleClear = () => {
    setFormState((prevState) => ({
      messageType: "",
      messageDate: new Date().toISOString().split("T")[0],
      smsTo: prevState.smsTo,
      initiatedBy: "",
      initiationRemarks: "",
      messageTime: "",
      schoolAdmissionNo: "",
      barcode: "",
      message: "",
    }));

    setFilterState({ schoolAdmissionNo: "", barcode: "" });
    setSelectedMessageType("");
    setIsChecked(false);
    setTableData({});
    setSelectedStudents([]);
  };
  // Close the current page
  const handleClose = () => navigate("/admin/student-message");
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchInitiatedByList();
      setInitiatedByList(data);
    };
    fetchData();
  }, []);
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  // Set default message date on mount
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setFormState((prevState) => ({
      ...prevState,
      messageDate: formattedDate,
    }));
  }, []);
  // Fetch message types
  useEffect(() => {
    const loadMessageTypes = async () => {
      const types = await fetchMessageTypes();
      setMessageTypes(types);
    };

    loadMessageTypes();
  }, []);

  // Fetch initiatedBy options
  useEffect(() => {
    const loadInitiatedByOptions = async () => {
      const list = await fetchInitiatedByList();
      setInitiatedByList(list);
    };

    loadInitiatedByOptions();
  }, []);

  useEffect(() => {
    setIsDisabled(selectedMessageType === "");
  }, [selectedMessageType]);

  const messageTypeOptions = messageTypes.map((type) => ({
    value: type.id,
    label: type.message_type_description,
  }));

  // Handle selection
  const handleSelectChange = (selectedOption) => {
    setSelectedMessageType(selectedOption?.value || "");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSelectStudents = (students) => {
    setSelectedStudents(students);
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);

    if (!selectedStudents || selectedStudents.length === 0) {
      return;
    }

    const updatedTableData = {};

    selectedStudents.forEach((student) => {
      const studentId =
        student.student_id || student?.studentBasicDetails?.id || null;

      if (!studentId) return; // Prevent crash

      updatedTableData[studentId] = checked
        ? {
            initiatedBy: formState.initiatedBy || "",
            initiationRemarks: formState.initiationRemarks || "",
            message: formState.message || "",
          }
        : {
            initiatedBy: "",
            initiationRemarks: "",
            message: "",
          };
    });

    setTableData((prev) => ({
      ...prev,
      ...updatedTableData,
    }));
  };

  const handleTableDataChange = (e, studentId) => {
    const { name, value } = e.target;

    setTableData((prevTableData) => ({
      ...prevTableData,
      [studentId]: {
        ...prevTableData[studentId],
        [name]: value,
      },
    }));
  };

  const handleSendMessage = async () => {
    // --- VALIDATIONS ----------------------------------------------------

    if (!selectedMessageType) {
      alert("Please select a Message Type.");
      return;
    }

    if (!formState.messageTime) {
      alert("Please select Message Time.");
      return;
    }

    if (!selectedStudents || selectedStudents.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    // Validate each row
    for (let student of selectedStudents) {
      const studentId = student.student_id || student?.studentBasicDetails?.id;

      const row = tableData[studentId];

      if (!row || !row.initiatedBy) {
        alert("Initiated By is required for all selected students.");
        return;
      }

      if (!row.message || row.message.trim() === "") {
        alert("Message is required for all selected students.");
        return;
      }
    }

    // --- BUILD PAYLOAD ----------------------------------------------------

    const organization_id = Number(sessionStorage.getItem("organization_id"));
    const branch_id = Number(sessionStorage.getItem("branch_id"));
    const batch_id = selectedStudents[0]?.batch_id || 1;
    const course_id = selectedStudents[0]?.course_id || 1;
    const department_id = selectedStudents[0]?.department_id || 1;
    const semester_id = selectedStudents[0]?.semester_id || 1;
    const section_id = selectedStudents[0]?.section || 1;
    const academic_year_id = selectedStudents[0]?.academic_year_id || 1;
    const login_id = Number(sessionStorage.getItem("userId"));

    const student_ids = [];
    const message_list = [];
    const initiated_by_ids = [];
    const initiated_remark_list = [];

    selectedStudents.forEach((student) => {
      const studentId = student.student_id || student?.studentBasicDetails?.id;

      const row = tableData[studentId];

      student_ids.push(studentId);
      message_list.push(row.message);
      initiated_by_ids.push(row.initiatedBy);
      initiated_remark_list.push(row.initiationRemarks || "");
    });

    // Convert Send SMS (F/M/B)
    const message_sent_to = formState.smsTo;

    const payload = {
      organization_id,
      branch_id,
      batch_id,
      course_id,
      department_id,
      academic_year_id,
      semester_id,
      section_id,
      login_id,
      message_list,
      message_type: Number(selectedMessageType),
      message_date: formState.messageDate,
      message_time: formState.messageTime,
      message_sent_to,
      student_ids,
      initiated_by_ids,
      initiated_remark_list,
    };

    console.log("FINAL PAYLOAD:", payload);

    // --- API CALL ----------------------------------------------------
    const token = localStorage.getItem("accessToken"); // ✅ Get token

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}MessageSend/StudentMessageCreate/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Add token
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.message === "message send successfully!!") {
        alert("Message Sent Successfully!");
        handleClear();
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("SEND ERROR:", error);
      alert("Something went wrong while sending message.");
    }
  };

  useEffect(() => {
    const fetchFullStudentData = async () => {
      try {
        const academicSessionId = localStorage.getItem("academicSessionId");
        const token = localStorage.getItem("accessToken"); // ✅ Get token
        if (!academicSessionId) {
          console.error("No academic session ID found in local storage");
          return;
        }
        const response = await fetch(
          `${ApiUrl.apiurl}STUDENTREGISTRATIONAPI/GetAllSTUDENTList/${academicSessionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Add token
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error fetching student data");
        }
        const data = await response.json();
        if (data.data) {
          setFullStudentData(data.data);
        } else {
          console.warn("No data found for the given academic session ID");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchFullStudentData();
  }, []);

  const handleAddStudents = async () => {
    const admissionNo = filterState.schoolAdmissionNo?.trim();
    const barcode = filterState.barcode?.trim();

    if (!admissionNo && !barcode) {
      alert("Please enter College Admission No OR Barcode");
      return;
    }

    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken"); // ✅ Get token

    const apiUrl = `${ApiUrl.apiurl}StudentCourse/StudentCourseRecordFilter/?organization_id=${organizationId}&branch_id=${branchId}`;

    try {
      // const response = await fetch(apiUrl);
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Add token
        },
      });
      const result = await response.json();

      if (result.message !== "success!!") {
        alert("API Error!");
        return;
      }

      const students = result.data || [];

      // ✔ Filter matching student
      const filtered = students.filter((student) => {
        const admMatch = admissionNo
          ? String(student.college_admission_no).includes(admissionNo)
          : true;

        const barMatch = barcode
          ? String(student.barcode).includes(barcode)
          : true;

        return admMatch && barMatch;
      });

      if (filtered.length === 0) {
        alert("No matching student found!");
        return;
      }

      // ✔ Convert into table format
      const newStudents = filtered.map((s) => ({
        student_id: s.student_id,
        student_name: s.student_name,
        batch_code: s.batch_code,
        course_name: s.course_name,
        department_code: s.department_code,
        semester_name: s.semester_name,
        section_name: s.section_name,
        enrollment_no: s.enrollment_no,
        college_admission_no: s.college_admission_no,
        barcode: s.barcode,
        father_name: s.father_name,
        mother_name: s.mother_name,
      }));

      // ✔ Remove duplicates
      const combined = [
        ...selectedStudents,
        ...newStudents.filter(
          (st) => !selectedStudents.some((e) => e.student_id === st.student_id)
        ),
      ];

      setSelectedStudents(combined);

      // ✔ Create tableData rows
      const updatedTableData = { ...tableData };
      combined.forEach((st) => {
        if (!updatedTableData[st.student_id]) {
          updatedTableData[st.student_id] = {
            initiatedBy: "",
            initiationRemarks: "",
            message: "",
          };
        }
      });

      setTableData(updatedTableData);

      // Reset filters
      setFilterState({
        schoolAdmissionNo: "",
        barcode: "",
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Failed to fetch student!");
    }
  };

  // const handleRemoveRow = (studentId) => {
  //   // Remove the student from the selectedStudents
  //   const updatedStudents = selectedStudents.filter(
  //     (student) => student.studentBasicDetails.id !== studentId
  //   );
  //   setSelectedStudents(updatedStudents);
  //   const updatedTableData = { ...tableData };
  //   delete updatedTableData[studentId];
  //   setTableData(updatedTableData);
  // };

  const handleRemoveRow = (studentId) => {
    // Remove student from selectedStudents
    const updatedStudents = selectedStudents.filter(
      (student) => student.student_id !== studentId
    );

    setSelectedStudents(updatedStudents);

    // Remove corresponding tableData
    setTableData((prev) => {
      const updated = { ...prev };
      delete updated[studentId];
      return updated;
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                STUDENT MESSAGE
              </p>

              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSendMessage}
                  >
                    Send Message
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={() => navigate("/admin/student-message")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1  mt-2">
                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="message-type" className="form-label">
                          Message Type
                        </label>
                        <Select
                          inputId="message-type"
                          className="detail"
                          classNamePrefix="detail"
                          options={messageTypeOptions}
                          onChange={handleSelectChange}
                          placeholder="Select message type"
                          value={
                            messageTypeOptions.find(
                              (option) => option.value === selectedMessageType
                            ) || null
                          }
                        />
                      </div>

                      <div className="col-12 col-md-3 mt-4 ">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm mb-3"
                          disabled={isDisabled}
                          onClick={handleOpenModal}
                        >
                          Add Student(s)
                        </button>
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <div className="mb-3">
                          <label htmlFor="messageDate" className="form-label">
                            Message Date
                          </label>
                          <input
                            type="date"
                            className="form-control detail"
                            id="messageDate"
                            name="messageDate"
                            value={formState.messageDate}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <div className="mb-3">
                          <label className="form-label">Send SMS to</label>
                          <div className="d-flex">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="smsTo"
                                id="smsToFather"
                                value="F"
                                checked={formState.smsTo === "F"}
                                onChange={handleChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="smsToFather"
                              >
                                Father
                              </label>
                            </div>
                            <div className="form-check me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="smsTo"
                                id="smsToMother"
                                value="M"
                                checked={formState.smsTo === "M"}
                                onChange={handleChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="smsToMother"
                              >
                                Mother
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="smsTo"
                                id="smsToBoth"
                                value="B"
                                checked={formState.smsTo === "B"}
                                onChange={handleChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="smsToBoth"
                              >
                                Both
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <div className="mb-3">
                          <label htmlFor="messageTime" className="form-label">
                            Message Time
                          </label>
                          <input
                            type="time"
                            className="form-control detail"
                            id="messageTime"
                            name="messageTime"
                            value={formState.messageTime}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <div className="mb-3">
                          <label
                            htmlFor="schoolAdmissionNo"
                            className="form-label"
                          >
                            College Admission No
                          </label>
                          <input
                            type="text"
                            className="form-control detail"
                            id="schoolAdmissionNo"
                            name="schoolAdmissionNo"
                            value={filterState.schoolAdmissionNo}
                            onChange={(e) =>
                              setFilterState({
                                ...filterState,
                                schoolAdmissionNo: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <div className="mb-3">
                          <label htmlFor="barcode" className="form-label">
                            Barcode
                          </label>
                          <input
                            type="text"
                            className="form-control detail"
                            id="barcode"
                            name="barcode"
                            value={filterState.barcode}
                            onChange={(e) =>
                              setFilterState({
                                ...filterState,
                                barcode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mt-4">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm mb-3"
                          onClick={handleAddStudents}
                        >
                          Add Students
                        </button>
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="from-class" className="form-label">
                          Initiated By
                        </label>
                        <Select
                          inputId="from-class"
                          className="detail"
                          classNamePrefix="detail"
                          name="initiatedBy"
                          options={initiatedByOptions}
                          placeholder="Select initiated by"
                          value={
                            initiatedByOptions.find(
                              (option) => option.value === formState.initiatedBy
                            ) || null
                          }
                          onChange={handleInitiatedByChange}
                        />
                      </div>
                      <div className="col-12 col-md-3 mb-4">
                        <div className="mb-3">
                          <label
                            htmlFor="initiationRemarks"
                            className="form-label"
                          >
                            Initiation Remarks
                          </label>
                          <input
                            type="text"
                            className="form-control detail"
                            id="initiationRemarks"
                            name="initiationRemarks"
                            value={formState.initiationRemarks}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="message" className="form-label">
                          Message
                        </label>
                        <textarea
                          className="form-control detail"
                          id="message"
                          rows="3"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          style={{ resize: "both", overflow: "auto" }}
                        ></textarea>
                        <div className="form-check mt-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="copyMessageDetails"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="copyMessageDetails"
                          >
                            Copy Message Details
                          </label>
                        </div>
                      </div>

                      <Modal
                        show={showModal}
                        handleClose={handleCloseModal}
                        onSelectStudent={handleSelectStudents}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Session</th>
                        <th>Course</th>
                        <th>Department</th>
                        <th>Semester</th>
                        <th>Section</th>
                        <th>Roll No</th>
                        <th
                          style={{ paddingLeft: "50px", paddingRight: "50px" }}
                        >
                          Student Name
                        </th>
                        <th>College Admission No</th>
                        <th>Barcode</th>
                        <th
                          style={{ paddingLeft: "50px", paddingRight: "50px" }}
                        >
                          Father Name
                        </th>
                        <th
                          style={{ paddingLeft: "50px", paddingRight: "50px" }}
                        >
                          Mother Name
                        </th>
                        <th
                          style={{ paddingLeft: "40px", paddingRight: "40px" }}
                        >
                          Initiated By
                        </th>
                        <th
                          style={{ paddingLeft: "40px", paddingRight: "40px" }}
                        >
                          Initiation Remarks
                        </th>
                        <th
                          style={{ paddingLeft: "60px", paddingRight: "60px" }}
                        >
                          Message
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudents.length > 0 ? (
                        selectedStudents.map((student, index) => {
                          const details = student;
                          const studentId = details.student_id;
                          const studentRow = tableData[studentId] || {};

                          return (
                            <tr key={studentId}>
                              <td>{index + 1}</td>
                              <td>{details.batch_code}</td>
                              <td>{details.course_name}</td>
                              <td>{details.department_code}</td>
                              <td>{details.semester_name}</td>
                              <td>{details.section_name}</td>
                              <td>{details.enrollment_no}</td>
                              <td>{details.student_name}</td>
                              <td>{details.college_admission_no}</td>
                              <td>{details.barcode}</td>
                              <td>{details.father_name}</td>
                              <td>{details.mother_name}</td>
                              <td>
                                <select
                                  className="form-select"
                                  value={studentRow.initiatedBy || ""}
                                  name="initiatedBy"
                                  onChange={(e) =>
                                    handleTableDataChange(e, studentId)
                                  }
                                >
                                  <option value="">Select initiated by</option>
                                  {initiatedByList.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.initiated_by_description}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control detail"
                                  name="initiationRemarks"
                                  value={studentRow.initiationRemarks || ""}
                                  onChange={(e) =>
                                    handleTableDataChange(e, studentId)
                                  }
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control detail"
                                  rows="2"
                                  name="message"
                                  value={studentRow.message || ""}
                                  onChange={(e) =>
                                    handleTableDataChange(e, studentId)
                                  }
                                ></textarea>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => handleRemoveRow(studentId)}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="12" className="text-center">
                            No record found.
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

export default SelectedStudentTable;
