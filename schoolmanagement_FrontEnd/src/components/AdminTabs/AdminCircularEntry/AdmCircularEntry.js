import React, { useState, useEffect, useRef } from "react";
import "./AdmCircularEntry.css";
import { fetchInitiatedByList } from "../../hooks/fetchInitiatedByList";
import { ApiUrl } from "../../../ApiUrl";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseList from "../../hooks/useFetchCourseList";
import useFetchBranchList from "../../hooks/useFetchBranchList";
import useFetchAcademicYearList from "../../hooks/useFetchAcademicYearList";
import useFetchSemesterList from "../../hooks/useFetchSemesterList";
import useFetchSectionList from "../../hooks/useFetchSectionList";
import ReactSelect, { components } from "react-select";

const CircularEntry = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const organizationId = sessionStorage.getItem("organization_id");
  const branchId = sessionStorage.getItem("branch_id");

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [uploadCircular, setUploadCircular] = useState(null);
  const circularDateRef = useRef(null);
  const circularDetailRef = useRef(null);
  const circularFileRef = useRef(null);

  // Multi-select states
  const [sessionSelections, setSessionSelections] = useState({});
  const [courseSelections, setCourseSelections] = useState({});
  const [branchSelections, setBranchSelections] = useState({});
  const [academicYearSelections, setAcademicYearSelections] = useState({});
  const [semesterSelections, setSemesterSelections] = useState({});
  const [sectionSelections, setSectionSelections] = useState({});

  // Select All checkboxes
  const [selectAllSession, setSelectAllSession] = useState(false);
  const [selectAllCourse, setSelectAllCourse] = useState(false);
  const [selectAllBranch, setSelectAllBranch] = useState(false);
  const [selectAllAcademicYear, setSelectAllAcademicYear] = useState(false);
  const [selectAllSemester, setSelectAllSemester] = useState(false);
  const [selectAllSection, setSelectAllSection] = useState(false);

  const selectedBatchIds = Object.keys(sessionSelections).filter((id) => sessionSelections[id]);
  const selectedCourseIds = Object.keys(courseSelections).filter((id) => courseSelections[id]);
  const selectedDeptIds = Object.keys(branchSelections).filter((id) => branchSelections[id]);
  const selectedYearIds = Object.keys(academicYearSelections).filter((id) => academicYearSelections[id]);
  const selectedSemIds = Object.keys(semesterSelections).filter((id) => semesterSelections[id]);
  const selectedSecIds = Object.keys(sectionSelections).filter((id) => sectionSelections[id]);

  // Fetch dropdown data dynamically based on selections
  const { BatchList, loading: loadingBatch } = useFetchSessionList(
    organizationId,
    branchId
  );
  const { CourseList, loading: loadingCourse } = useFetchCourseList(
    organizationId,
    selectedBatchIds
  );
  const { BranchList, loading: loadingDept } = useFetchBranchList(
    organizationId,
    branchId,
    selectedBatchIds,
    selectedCourseIds
  );
  const { AcademicYearList, loading: loadingAY } = useFetchAcademicYearList(
    organizationId,
    branchId,
    selectedBatchIds,
    selectedCourseIds,
    selectedDeptIds
  );
  const { SemesterList, loading: loadingSem } = useFetchSemesterList(
    organizationId,
    branchId,
    selectedBatchIds,
    selectedCourseIds,
    selectedDeptIds,
    selectedYearIds
  );
  const { SectionList, loading: loadingSec } = useFetchSectionList(
    organizationId,
    branchId,
    selectedBatchIds,
    selectedCourseIds,
    selectedDeptIds,
    selectedYearIds,
    selectedSemIds
  );


  const [updateCircularId, setUpdateCircularId] = useState(null);
  const [circularFileUrl, setCircularFileUrl] = useState(null);
  const [circularList, setCircularList] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [circularDate, setCircularDate] = useState("");
  const [circularTime, setCircularTime] = useState("");
  const [circularDetails, setCircularDetails] = useState("");
  const [sendSmsTo, setSendSmsTo] = useState("Both");
  const [sendSms, setSendSms] = useState(false);
  const [approved, setApproved] = useState(false);
  const [initiatedByList, setInitiatedByList] = useState([]);
  const [filters, setFilters] = useState({
    classIds: [],
    sectionIds: [],
    initiatedById: "",
  });
  const [initiatedBy, setInitiatedBy] = useState(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);
  const handleInitiatedByChange = (e) => {
    const newValue = e.target.value;
    setSelectedInitiatedBy(newValue); // Update the dropdown value
    setInitiatedBy(newValue); // Optional: Update if needed elsewhere
  };
  const [selections, setSelections] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [selectedInitiatedBy, setSelectedInitiatedBy] = useState("");
  const [sendTo, setSendTo] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected); // react-paginate is 0-based
  };

  const offset = currentPage * itemsPerPage;

  const currentItems = circularList.slice(offset, offset + itemsPerPage);

  const pageCount = Math.ceil(circularList.length / itemsPerPage);

  const fetchCircularList = () => {
    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken"); // ✅ token

    const batchIds = Object.keys(sessionSelections).filter(
      (id) => sessionSelections[id]
    );
    const courseIds = Object.keys(courseSelections).filter(
      (id) => courseSelections[id]
    );
    const deptIds = Object.keys(branchSelections).filter(
      (id) => branchSelections[id]
    );
    const yearIds = Object.keys(academicYearSelections).filter(
      (id) => academicYearSelections[id]
    );
    const semIds = Object.keys(semesterSelections).filter(
      (id) => semesterSelections[id]
    );
    const secIds = Object.keys(sectionSelections).filter(
      (id) => sectionSelections[id]
    );

    const circularDate = circularDateRef.current?.value || "";

    const apiUrl =
      `${ApiUrl.apiurl}CircularMessage/GetAllCircularMessageList/?` +
      `organization_id=${organizationId}&branch_id=${branchId}` +
      `&batch_ids=[${batchIds.join(",")}]` +
      `&course_ids=[${courseIds.join(",")}]` +
      `&department_ids=[${deptIds.join(",")}]` +
      `&academic_year_ids=[${yearIds.join(",")}]` +
      `&semester_ids=[${semIds.join(",")}]` +
      `&section_ids=[${secIds.join(",")}]` +
      `&circular_date=${circularDate}`;

    console.log("Final API URL:", apiUrl);

    fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ token passed
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setCircularList(data.data);
        } else {
          setCircularList([]);
        }
      })
      .catch((err) => console.error("Error fetching circular list:", err));
  };

  //12-17-2025
  const fetchAllCirculars = () => {
    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken"); // ✅ token

    fetch(
      `${ApiUrl.apiurl}CircularMessage/GetAllCircularMessageList/?organization_id=${organizationId}&branch_id=${branchId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ token passed
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setCircularList(data.data);
        } else {
          setCircularList([]);
        }
      })
      .catch((err) => console.error("Error fetching all circulars:", err));
  };

  // For Batch  (11-19-2025)
  const handleBatchSelect = (id) => {
    setSessionSelections((prev) => {
      const updated = { ...prev, [id]: !prev[id] };

      const selectedIds = Object.keys(updated).filter((x) => updated[x]);

      setSelectedBatch(selectedIds.length > 0 ? selectedIds[0] : null);

      return updated;
    });
  };

  // Handle Select All for batch
  const handleSelectAllBatch = () => {
    const newVal = !selectAllSession;
    setSelectAllSession(newVal);

    const updated = {};
    BatchList?.forEach((b) => (updated[b.id] = newVal));
    setSessionSelections(updated);

    // Set selectedBatch correctly
    setSelectedBatch(newVal ? BatchList[0]?.id : null);
  };

  // For Course
  const handleCourseSelect = (id) => {
    setCourseSelections((prev) => {
      const updated = { ...prev, [id]: !prev[id] };

      const selectedIds = Object.keys(updated).filter((x) => updated[x]);

      setSelectedCourse(selectedIds.length > 0 ? selectedIds[0] : null);

      return updated;
    });
  };

  // Handle Select All for Course
  const handleSelectAllCourse = () => {
    const newVal = !selectAllCourse;
    setSelectAllCourse(newVal);

    const updated = {};
    CourseList?.forEach((c) => (updated[c.id] = newVal));
    setCourseSelections(updated);

    setSelectedCourse(newVal ? CourseList[0]?.id : null);
  };

  // For Branch/Department
  const handleBranchSelect = (id) => {
    setBranchSelections((prev) => {
      const updated = { ...prev, [id]: !prev[id] };

      const selectedIds = Object.keys(updated).filter((x) => updated[x]);

      setSelectedDepartment(selectedIds.length > 0 ? selectedIds[0] : null);

      return updated;
    });
  };

  // Handle Select All for Branch
  const handleSelectAllBranch = () => {
    const newVal = !selectAllBranch;
    setSelectAllBranch(newVal);

    const updated = {};
    BranchList?.forEach((b) => (updated[b.id] = newVal));
    setBranchSelections(updated);

    setSelectedDepartment(newVal ? BranchList[0]?.id : null);
  };

  // For Academic Year
  const handleAcademicYearSelect = (id) => {
    setAcademicYearSelections((prev) => {
      const updated = { ...prev, [id]: !prev[id] };

      const selectedIds = Object.keys(updated).filter((x) => updated[x]);

      setSelectedAcademicYear(selectedIds.length > 0 ? selectedIds[0] : null);

      return updated;
    });
  };

  // Handle Select All for Academic Year
  const handleSelectAllAcademicYear = () => {
    const newVal = !selectAllAcademicYear;
    setSelectAllAcademicYear(newVal);

    const updated = {};
    AcademicYearList?.forEach((a) => (updated[a.id] = newVal));
    setAcademicYearSelections(updated);

    setSelectedAcademicYear(newVal ? AcademicYearList[0]?.id : null);
  };

  // For Semester
  const handleSemesterSelect = (id) => {
    setSemesterSelections((prev) => {
      const updated = { ...prev, [id]: !prev[id] };

      const selectedIds = Object.keys(updated).filter((x) => updated[x]);

      setSelectedSemester(selectedIds.length > 0 ? selectedIds[0] : null);

      return updated;
    });
  };

  // Handle Select All for Semester
  const handleSelectAllSemester = () => {
    const newVal = !selectAllSemester;
    setSelectAllSemester(newVal);

    const updated = {};
    SemesterList?.forEach((s) => (updated[s.id] = newVal));
    setSemesterSelections(updated);

    setSelectedSemester(newVal ? SemesterList[0]?.id : null);
  };

  // ------------------------- End Of Dropdown Fetch ---------------------------
  const sessionMapped = BatchList?.map((x) => ({
    id: x.id,
    label: x.batch_description,
  }));

  const courseMapped = CourseList?.map((x) => ({
    id: x.id,
    label: x.course_name,
  }));

  const branchMapped = BranchList?.map((x) => ({
    id: x.id,
    label: x.department_description,
  }));

  const yearMapped = AcademicYearList?.map((x) => ({
    id: x.id,
    label: x.academic_year_description,
  }));

  const semesterMapped = SemesterList?.map((x) => ({
    id: x.id,
    label: x.semester_description,
  }));

  const sectionMapped = SectionList?.map((x) => ({
    id: x.id,
    label: x.section_name,
  }));

  const resetForm = () => {
    // Clear dropdown selections
    setSelectedBatch(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    setSessionSelections({});
    setCourseSelections({});
    setBranchSelections({});
    setAcademicYearSelections({});
    setSemesterSelections({});
    setSectionSelections({});

    setSelectAllSession(false);
    setSelectAllCourse(false);
    setSelectAllBranch(false);
    setSelectAllAcademicYear(false);
    setSelectAllSemester(false);
    setSelectAllSection(false);

    // Clear textual inputs
    setCircularDate("");
    setCircularTime("");
    setCircularDetails("");
    setUploadCircular(null);
    setCircularFileUrl(null);

    // Reset dropdown
    setSelectedInitiatedBy("");

    // Reset options
    setSendSms(false);
    setSendSmsTo("Both");
    setApproved(false);

    // Clear file input manually
    if (circularFileRef.current) circularFileRef.current.value = "";
  };

  const handleSave = async () => {
    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken"); // ✅ token

    if (!circularDateRef.current?.value) {
      alert("Please select Circular Date");
      return;
    }
    if (!circularTime) {
      alert("Please select Circular Time");
      return;
    }
    if (!selectedInitiatedBy) {
      alert("Please select Issued By");
      return;
    }
    if (!uploadCircular) {
      alert("Please upload Circular File");
      return;
    }
    if (!circularDetails.trim()) {
      alert("Please enter Circular Details");
      return;
    }

    const batchIds = Object.keys(sessionSelections).filter(
      (id) => sessionSelections[id]
    );
    const courseIds = Object.keys(courseSelections).filter(
      (id) => courseSelections[id]
    );
    const deptIds = Object.keys(branchSelections).filter(
      (id) => branchSelections[id]
    );
    const yearIds = Object.keys(academicYearSelections).filter(
      (id) => academicYearSelections[id]
    );
    const semIds = Object.keys(semesterSelections).filter(
      (id) => semesterSelections[id]
    );
    const secIds = Object.keys(sectionSelections).filter(
      (id) => sectionSelections[id]
    );

    if (
      batchIds.length === 0 ||
      courseIds.length === 0 ||
      deptIds.length === 0 ||
      yearIds.length === 0 ||
      semIds.length === 0 ||
      secIds.length === 0
    ) {
      alert("Please select all filters before bulk save");
      return;
    }

    const batchId = batchIds[0];
    const formData = new FormData();

    formData.append("course_ids", `[${courseIds.join(",")}]`);
    formData.append("department_ids", `[${deptIds.join(",")}]`);
    formData.append("academic_year_ids", `[${yearIds.join(",")}]`);
    formData.append("semester_ids", `[${semIds.join(",")}]`);
    formData.append("section_ids", `[${secIds.join(",")}]`);

    formData.append("batch_id", batchId);
    formData.append("batch_ids", `[${batchIds.join(",")}]`);
    formData.append("organization_id", organizationId);
    formData.append("branch_id", branchId);
    formData.append("initiated_by", selectedInitiatedBy);
    formData.append("created_by", "1");

    formData.append("circular_date", circularDateRef.current.value);
    formData.append("circular_time", circularTime);
    formData.append("circular_detail", circularDetails);

    formData.append("circular_status", approved ? "A" : "P");
    formData.append("send_sms", sendSms ? "B" : "N");
    formData.append("message_status", "P");

    // const smsMap = { Father: "F", Mother: "M", Both: "B",Student: "S"};
    // formData.append("circular_sent_to", smsMap[sendSmsTo]);

    const smsMap = { Father: "F", Mother: "M", Both: "B", Student: "S" };

    // Determine who should receive SMS
    const finalSendTo = sendTo === "Student" ? "Student" : sendSmsTo;

    // Safety check
    if (!finalSendTo) {
      alert("Please select Send SMS To option");
      return;
    }

    formData.append("circular_sent_to", smsMap[finalSendTo]);

    if (uploadCircular) formData.append("circular_file", uploadCircular);

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}CircularMessage/CreateCircularMessage/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token passed
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log("BULK SAVE RESULT:", result);

      if (result.message?.toLowerCase().includes("success")) {
        alert("Circular Saved Successfully!");
        fetchAllCirculars();
        resetForm();
      } else {
        alert("Bulk Save Failed: " + JSON.stringify(result));
      }
    } catch (error) {
      console.error("Bulk Save Error:", error);
      alert("Something went wrong while bulk saving!");
    }
  };

  const handleEditClick = async (circularId) => {
    // ⭐ Scroll to top when Edit is clicked
    window.scrollTo({ top: 0, behavior: "smooth" });

    const token = localStorage.getItem("accessToken"); // ✅ token

    try {
      const res = await fetch(
        `${ApiUrl.apiurl}CircularMessage/GetCircularMessageBasedId/?circular_id=${circularId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token passed
          },
        }
      );

      const result = await res.json();

      if (result.message !== "Success" || !result.data) {
        alert("Failed to load circular details!");
        return;
      }

      const item = result.data;

      // SET update ID (IMPORTANT FIX)
      setUpdateCircularId(item.id);

      // Dropdown Selections
      setSelectedBatch(item.batch_id);
      setSelectedCourse(item.course_id);
      setSelectedDepartment(item.department_id);
      setSelectedAcademicYear(item.academicyearId);
      setSelectedSemester(item.semester_id);
      setSelectedSection(item.section_id);

      setSessionSelections({ [item.batch_id]: true });
      setCourseSelections({ [item.course_id]: true });
      setBranchSelections({ [item.department_id]: true });
      setAcademicYearSelections({ [item.academicyearId]: true });
      setSemesterSelections({ [item.semester_id]: true });
      setSectionSelections({ [item.section_id]: true });

      setCircularDate(item.circular_date);
      setCircularTime(item.circular_time);
      setCircularDetails(item.circular_details);

      setCircularFileUrl(item.circular_file_url);
      setUploadCircular(null);

      setSelectedInitiatedBy(item.InitiatedById);

      setApproved(item.circular_status === "A");
      setSendSms(item.send_sms === "Y");

      const smsReverseMap = {
        F: "Father",
        M: "Mother",
        B: "Both",
        S: "Student",
      };
      setSendSmsTo(smsReverseMap[item.sms_sent_to] || "Both");

      setIsSaveDisabled(true);
      setIsUpdateDisabled(false);
    } catch (error) {
      console.error(error);
      alert("Error loading data!");
    }
  };

  const handleUpdate = async () => {
    if (!updateCircularId) {
      alert("No circular selected for update");
      return;
    }

    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken"); // ✅ token

    const formData = new FormData();

    // MUST MATCH API EXACTLY
    formData.append("course", selectedCourse || "");
    formData.append("department", selectedDepartment || "");
    formData.append("academic_year", selectedAcademicYear || "");
    formData.append("semester", selectedSemester || "");
    formData.append("section", selectedSection || "");
    formData.append("batch", selectedBatch || "");

    formData.append("circular_date", circularDate);
    formData.append("circular_time", circularTime);
    formData.append("circular_details", circularDetails);

    formData.append("initiated_by", selectedInitiatedBy || "");
    formData.append("organization", organizationId);
    formData.append("branch", branchId);

    formData.append("circular_status", approved ? "A" : "P");
    formData.append("send_sms", sendSms ? "Y" : "N");

    // const smsMap = { Father: "F", Mother: "M", Both: "B", Student: "S" };
    // formData.append("circular_sent_to", smsMap[sendSmsTo]);

    const smsMap = { Father: "F", Mother: "M", Both: "B", Student: "S" };

    const finalSendTo = sendTo === "Student" ? "Student" : sendSmsTo;

    if (!finalSendTo) {
      alert("Please select Send SMS To option");
      return;
    }

    formData.append("circular_sent_to", smsMap[finalSendTo]);

    formData.append("message_status", "P");
    formData.append("updated_by", "1");

    if (uploadCircular) {
      formData.append("circular_file", uploadCircular);
    } else if (circularFileUrl) {
      formData.append("circular_file_url", circularFileUrl);
    }

    try {
      const res = await fetch(
        `${ApiUrl.apiurl}CircularMessage/UpdateCircularMessage/?organization_id=${organizationId}&branch_id=${branchId}&circular_id=${updateCircularId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token passed
          },
          body: formData,
        }
      );

      const result = await res.json();
      console.log("UPDATE RESULT:", result);

      if (result.message === "Circular Message updated successfully.") {
        alert("Circular Message updated successfully!");
        fetchAllCirculars();
        resetForm();

        setIsSaveDisabled(false);
        setIsUpdateDisabled(true);
        setUpdateCircularId(null);
      } else {
        alert("Update failed: " + JSON.stringify(result));
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Something went wrong!");
    }
  };

  const handleDelete = async (circularId) => {
    if (!window.confirm("Are you sure you want to delete this circular?")) {
      return;
    }

    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken"); // ✅ token

    try {
      const res = await fetch(
        `${ApiUrl.apiurl}CircularMessage/DeleteCircularMessage/?organization_id=${organizationId}&branch_id=${branchId}&circular_id=${circularId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token passed
          },
        }
      );

      const result = await res.json();
      console.log("DELETE RESULT:", result);

      if (result.message === "Circular message Deleted Successfully") {
        alert("Circular deleted successfully.");
        fetchCircularList(); // refresh the list instantly
      } else {
        alert("Delete failed: " + JSON.stringify(result));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong!");
    }
  };

  const handleCancelClick = async (circularId) => {
    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken"); // ✅ token

    if (!window.confirm("Are you sure you want to cancel this circular?")) {
      return;
    }

    try {
      const res = await fetch(
        `${ApiUrl.apiurl}CircularMessage/CancelCircularMessage/?organization_id=${organizationId}&branch_id=${branchId}&circular_id=${circularId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token passed
          },
        }
      );

      const result = await res.json();
      console.log("CANCEL RESULT:", result);

      if (result.message === "Circular message Cancel Successfully") {
        alert("Circular message Cancel Successfully");

        // 🔥 INSTANT UI UPDATE (no need to reload full list)
        setCircularList((prev) =>
          prev.map((item) =>
            item.circular_id === circularId
              ? { ...item, is_cancelled: true, circular_status: "R" }
              : item
          )
        );
      } else {
        alert("Cancel failed: " + JSON.stringify(result));
      }
    } catch (err) {
      console.error("Cancel Error:", err);
      alert("Something went wrong!");
    }
  };

  const handleClearAll = () => {
    // Reset dropdown main selected values
    setSelectedBatch(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    // Reset checkbox selections
    setSessionSelections({});
    setCourseSelections({});
    setBranchSelections({});
    setAcademicYearSelections({});
    setSemesterSelections({});
    setSectionSelections({});

    // Reset "Select All" checkboxes
    setSelectAllSession(false);
    setSelectAllCourse(false);
    setSelectAllBranch(false);
    setSelectAllAcademicYear(false);
    setSelectAllSemester(false);
    setSelectAllSection(false);

    // Reset text inputs
    setCircularDate("");
    setCircularTime("");
    setCircularDetails("");

    // Reset file upload
    setUploadCircular(null);
    setCircularFileUrl(null);
    if (circularFileRef.current) circularFileRef.current.value = "";

    // Reset "Issued By"
    setSelectedInitiatedBy("");

    // Reset radio & checkboxes
    setSendSms(false);
    setSendSmsTo("Both");
    setApproved(false);

    // Reset Update/Save mode
    setIsSaveDisabled(false);
    setIsUpdateDisabled(true);
    setUpdateCircularId(null);
  };

  useEffect(() => {
    const organizationId = sessionStorage.getItem("organization_id");
    const branchId = sessionStorage.getItem("branch_id");
    const token = localStorage.getItem("accessToken"); // ✅ token

    fetch(
      `${ApiUrl.apiurl}MessageInitiated/GetAllMessageInitiatedList/?organization_id=${organizationId}&branch_id=${branchId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ token passed
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.message === "Success" && Array.isArray(result.data)) {
          setInitiatedByList(result.data);
        } else {
          setInitiatedByList([]);
          console.error("Invalid response:", result);
        }
      })
      .catch((err) => console.error("Error fetching initiated_by:", err));
  }, []);

  const handleSendSmsToChange = (e) => {
    setSendSmsTo(e.target.value);
    setSendTo("");
  };

  useEffect(() => {
    // fetchCircularList();
    fetchAllCirculars();
  }, []);

  // 12-09-2025
  const handleSelectAllSection = () => {
    const newVal = !selectAllSection;
    setSelectAllSection(newVal);

    const updated = {};
    sectionMapped?.forEach((s) => (updated[s.id] = newVal));
    setSectionSelections(updated);

    setSelectedSection(newVal ? sectionMapped[0]?.id : null);
  };

  return (
    <div className="container-fluid px-3">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <p className="text-center fw-bold fs-5">CIRCULAR ENTRY</p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "150px" }}
                    onClick={fetchCircularList}
                  >
                    Display
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "150px" }}
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "150px" }}
                    disabled={isUpdateDisabled}
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: "150px" }}
                    onClick={handleClearAll}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ width: "150px" }}
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="note mb-4 mt-4 ms-1 custom-section-box">
                <p style={{ fontSize: "14px" }}>Please Note:</p>
                <p style={{ fontSize: "14px" }}>
                  1. When Send SMS is selected, Circular details field length
                  will be limited to 159 characters.
                </p>
              </div>

              <div className="row g-3 circular-section-box custom-section-box ms-1">
                <div className="col-12 col-md-6 col-lg-3">
                  {/* Session Section */}
                  <div
                    className="filter-card"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px",
                      background: "#fff",
                      marginBottom: "12px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <label
                      className="form-label fw-bold"
                      style={{ fontSize: "14px" }}
                    >
                      Session
                    </label>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "4px 0",
                        borderBottom: "1px solid #e1e1e1",
                        marginBottom: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAllSession}
                        onChange={handleSelectAllBatch}
                      />
                      <label
                        style={{
                          marginLeft: "6px",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        Select All
                      </label>
                    </div>

                    <div className="filter-scroll">
                      {sessionMapped?.map((item) => (
                        <div key={item.id} className="filter-item">
                          <input
                            type="checkbox"
                            checked={sessionSelections[item.id] || false}
                            onChange={() => handleBatchSelect(item.id)}
                          />
                          <label
                            style={{ marginLeft: "6px", fontSize: "13px" }}
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* ---------- COURSE ---------- */}
                  <div
                    className="filter-card"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px",
                      background: "#fff",
                      marginBottom: "12px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <label
                      className="form-label fw-bold"
                      style={{ fontSize: "14px" }}
                    >
                      Course
                    </label>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "4px 0",
                        borderBottom: "1px solid #e1e1e1",
                        marginBottom: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAllCourse}
                        onChange={handleSelectAllCourse}
                      />
                      <label
                        style={{
                          marginLeft: "6px",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        Select All
                      </label>
                    </div>

                    <div className="filter-scroll">
                      {courseMapped?.map((item) => (
                        <div key={item.id} className="filter-item">
                          <input
                            type="checkbox"
                            checked={courseSelections[item.id] || false}
                            onChange={() => handleCourseSelect(item.id)}
                          />
                          <label
                            style={{ marginLeft: "6px", fontSize: "13px" }}
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* ---------- BRANCH / DEPARTMENT ---------- */}
                  <div
                    className="filter-card"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px",
                      background: "#fff",
                      marginBottom: "12px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <label
                      className="form-label fw-bold"
                      style={{ fontSize: "14px" }}
                    >
                      Department
                    </label>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "4px 0",
                        borderBottom: "1px solid #e1e1e1",
                        marginBottom: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAllBranch}
                        onChange={handleSelectAllBranch}
                      />
                      <label
                        style={{
                          marginLeft: "6px",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        Select All
                      </label>
                    </div>

                    <div className="filter-scroll">
                      {branchMapped?.map((item) => (
                        <div key={item.id} className="filter-item">
                          <input
                            type="checkbox"
                            checked={branchSelections[item.id] || false}
                            onChange={() => handleBranchSelect(item.id)}
                          />
                          <label
                            style={{ marginLeft: "6px", fontSize: "13px" }}
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Middle Section - Section, Academic Year & Semester */}
                <div className="col-12 col-md-6 col-lg-3">
                  {/* Academic Year Section */}
                  <div
                    className="filter-card"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px",
                      background: "#fff",
                      marginBottom: "12px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <label
                      className="form-label fw-bold"
                      style={{ fontSize: "14px" }}
                    >
                      Academic Year
                    </label>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "4px 0",
                        borderBottom: "1px solid #e1e1e1",
                        marginBottom: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAllAcademicYear}
                        onChange={handleSelectAllAcademicYear}
                      />
                      <label
                        style={{
                          marginLeft: "6px",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        Select All
                      </label>
                    </div>

                    <div className="filter-scroll">
                      {yearMapped?.map((item) => (
                        <div key={item.id} className="filter-item">
                          <input
                            type="checkbox"
                            checked={academicYearSelections[item.id] || false}
                            onChange={() => handleAcademicYearSelect(item.id)}
                          />
                          <label
                            style={{ marginLeft: "6px", fontSize: "13px" }}
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* ---------- SEMESTER ---------- */}
                  <div
                    className="filter-card"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px",
                      background: "#fff",
                      marginBottom: "12px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <label
                      className="form-label fw-bold"
                      style={{ fontSize: "14px" }}
                    >
                      Semester
                    </label>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "4px 0",
                        borderBottom: "1px solid #e1e1e1",
                        marginBottom: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAllSemester}
                        onChange={handleSelectAllSemester}
                      />
                      <label
                        style={{
                          marginLeft: "6px",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        Select All
                      </label>
                    </div>

                    <div className="filter-scroll">
                      {semesterMapped?.map((item) => (
                        <div key={item.id} className="filter-item">
                          <input
                            type="checkbox"
                            checked={semesterSelections[item.id] || false}
                            onChange={() => handleSemesterSelect(item.id)}
                          />
                          <label
                            style={{ marginLeft: "6px", fontSize: "13px" }}
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* ---------- SECTION ---------- */}
                  <div
                    className="filter-card"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px",
                      background: "#fff",
                      marginBottom: "12px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <label
                      className="form-label fw-bold"
                      style={{ fontSize: "14px" }}
                    >
                      Section
                    </label>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "4px 0",
                        borderBottom: "1px solid #e1e1e1",
                        marginBottom: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAllSection}
                        onChange={handleSelectAllSection}
                      />
                      <label
                        style={{
                          marginLeft: "6px",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        Select All
                      </label>
                    </div>

                    <div className="filter-scroll">
                      {sectionMapped?.map((item) => (
                        <div key={item.id} className="filter-item">
                          <input
                            type="checkbox"
                            checked={sectionSelections[item.id] || false}
                            onChange={() =>
                              setSectionSelections((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                              }))
                            }
                          />
                          <label
                            style={{ marginLeft: "6px", fontSize: "13px" }}
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Section - Form */}
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="circular-form-group">
                    <label>
                      Circular Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="form-control detail"
                      type="date"
                      ref={circularDateRef}
                      value={circularDate}
                      onChange={(e) => setCircularDate(e.target.value)}
                    />
                  </div>
                  <div className="circular-form-group">
                    <label className="form-label">Circular Time</label>
                    <input
                      className="form-control detail"
                      type="time"
                      value={circularTime}
                      onChange={(e) => setCircularTime(e.target.value)}
                    />
                  </div>
                  <div className="circular-form-group">
                    <label className="form-label">
                      Issued By <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="detail"
                      onChange={handleInitiatedByChange}
                      value={selectedInitiatedBy}
                    >
                      <option value="">Select issued by</option>
                      {initiatedByList.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.initiated_by}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="circular-form-group">
                    <label className="form-label">
                      Upload Circular <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      className="detail"
                      type="file"
                      ref={circularFileRef}
                      onChange={(e) => {
                        setUploadCircular(e.target.files[0]);
                        setCircularFileUrl(null);
                      }}
                    />

                    {/* 🔹 Show preview if editing and file exists */}
                    {circularFileUrl && !uploadCircular && (
                      <div className="mt-2">
                        <p>
                          Current File:<span style={{ color: "red" }}>*</span>
                        </p>
                        {circularFileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                          <img
                            src={circularFileUrl}
                            alt="Circular Preview"
                            style={{
                              maxWidth: "200px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <a
                            href={circularFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View File
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="circular-form-group">
                    <label>
                      Circular Details <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      rows="4"
                      value={circularDetails}
                      ref={circularDetailRef}
                      maxLength={sendSms ? 159 : 5000}
                      onChange={(e) => setCircularDetails(e.target.value)}
                    ></textarea>
                  </div>
                  <p>
                    (No. of characters left:{" "}
                    {sendSms
                      ? 159 - circularDetails.length
                      : 5000 - circularDetails.length}
                    )
                  </p>
                </div>

                {/* Options Section */}
                <div className="col-12 col-md-6 col-lg-3">
                  <label className="form-label">Send SMS To</label>
                  <div className="d-flex flex-wrap mb-2">
                    {["Father", "Mother", "Both"].map((value) => (
                      <div
                        className="d-flex align-items-center me-3"
                        key={value}
                      >
                        <input
                          type="radio"
                          id={value.toLowerCase()}
                          name="sendSmsTo"
                          value={value}
                          checked={sendSmsTo === value}
                          onChange={handleSendSmsToChange}
                          className="me-1"
                        />
                        <label htmlFor={value.toLowerCase()} className="mb-0">
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <input
                      type="radio"
                      id="student"
                      name="sendTo"
                      value="Student"
                      checked={sendTo === "Student"}
                      onChange={(e) => {
                        setSendTo(e.target.value);
                        setSendSmsTo("");
                      }}
                      className="me-1"
                    />
                    <label htmlFor="student"> Student</label>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <input
                      type="checkbox"
                      checked={sendSms}
                      onChange={(e) => setSendSms(e.target.checked)}
                      className="me-2"
                    />
                    <label className="mb-0">Send SMS</label>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <input
                      type="checkbox"
                      checked={approved}
                      onChange={(e) => setApproved(e.target.checked)}
                      className="me-2"
                    />
                    <label className="mb-0">Approved</label>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="row mt-4">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped mt-3">
                    <thead className="table-dark">
                      <tr>
                        <th>Sl No.</th>
                        <th>Circular Date</th>
                        <th>Session</th>
                        <th>Course</th>
                        <th>Department</th>
                        <th>Academic Year</th>
                        <th>Semester</th>
                        <th>Section</th>
                        <th>Issued By</th>
                        <th>Circular Details</th>
                        <th>Circular Time</th>
                        <th>Upload File</th>
                        <th>Status</th>
                        <th>Edit</th>
                        <th>Delete</th>
                        <th>Cancel</th>
                      </tr>
                    </thead>
                    <tbody>
                      {circularList.length === 0 ? (
                        <tr>
                          <td colSpan="12" className="text-center">
                            No data found
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((item, index) => (
                          <tr key={item.id}>
                            <td>{offset + index + 1}</td>
                            <td>{item.circular_date}</td>
                            <td>{item.batch_code}</td>
                            <td>{item.course_name}</td>
                            <td>{item.department_description}</td>
                            <td>{item.academic_year_code}</td>
                            <td>{item.semester_name}</td>
                            <td>{item.section_name}</td>
                            <td>{item.InitiatedBy}</td>
                            <td
                              className="circular-details-cell"
                              title={item.circular_details}
                            >
                              {item.circular_details}
                            </td>
                            <td>{item.circular_time}</td>
                            <td>
                              <a
                                href={item.circular_file}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View File
                              </a>
                            </td>
                            <td>
                              {item.circular_status === "A"
                                ? "Approved"
                                : item.circular_status === "P"
                                  ? "Pending"
                                  : "Rejected"}
                            </td>
                            <td>
                              <button
                                className="btn btn-primary"
                                disabled={
                                  item.circular_status === "A" ||
                                  item.is_cancelled
                                }
                                onClick={() =>
                                  handleEditClick(item.circular_id)
                                }
                              >
                                Edit
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                disabled={
                                  item.circular_status === "A" ||
                                  item.is_cancelled
                                }
                                onClick={() => handleDelete(item.circular_id)}
                              >
                                Delete
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-warning"
                                disabled={item.is_cancelled}
                                onClick={() =>
                                  handleCancelClick(item.circular_id)
                                }
                              >
                                {item.is_cancelled ? "Canceled" : "Cancel"}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center mt-3"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CircularEntry;
