
import React, { useState, useEffect } from "react";
import "./AdmFeeSearch.css";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import ReactPaginate from "react-paginate";
import fetchSessionList from "../../hooks/fetchSessionList"

const FeeSearchPage = () => {
  // Get today's date in YYYY-MM-DD format (local timezone)
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [viewReceipts, setViewReceipts] = useState(true); // Radio selection

  const [classOptions, setClassOptions] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [sectionOptions, setSectionOptions] = useState([]);
  const navigate = useNavigate();
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  // const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [viewOption, setViewOption] = useState("viewReceipts");
  const [showTable, setShowTable] = useState(false);
  const [receiptsData, setReceiptsData] = useState([]);
  const [receipts, setReceipts] = useState([]);

  const [classId, setClassId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bank, setBank] = useState(null);
  const [studentDetails, setStudentDetails] = useState();
  const [selectedSection, setSelectedSection] = useState();
  const [selectedSemester, setSelectedSemester] = useState();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [selectedCourse, setSelectedCourse] = useState();
  //  const [selectedSession, setSelectedSession] = useState( );
  const [period, setPeriod] = useState(null); // Stores selected period
  const [periodOptions, setPeriodOptions] = useState([]);

  const handleNewClick = () => {
    navigate("/feecollection");
  };
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [cancelRemark, setCancelRemark] = useState("");
  const [semesterOptions, setSemesterOptions] = useState([]);

  //  const [bankOptions, setBankOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null); // State for cancel remark
  const [currentPage, setCurrentPage] = useState(0);
  const receiptsPerPage = 10;
  const [bankOptions, setBankOptions] = useState([]);
  const [accountDetails, setAccountDetails] = useState([]);
  const [formData, setFormData] = useState({
    dateFrom: getTodayDate(),
    dateTo: getTodayDate(),
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState({
    receiptDate: "",
    amount: "",
    referenceDate: "",
    accountNumber: "",
    paymentMethodId: "",
    bankId: "",
    bankName: "",
  });

  // Payment method specific fields
  const [chequeNumber, setChequeNumber] = useState("");
  const [chequeBankName, setChequeBankName] = useState("");
  const [chequeBranchName, setChequeBranchName] = useState("");
  const [ddNumber, setDdNumber] = useState("");
  const [ddIssuingBank, setDdIssuingBank] = useState("");
  const [upiUtrNo, setUpiUtrNo] = useState("");
  const [rtgsUtrNo, setRtgsUtrNo] = useState("");
  const [rtgsSenderBank, setRtgsSenderBank] = useState("");
  const [rtgsAccountNo, setRtgsAccountNo] = useState("");
  const handleSelectStudent = async (selectedStudent) => {
    try {
      const studentId =
        selectedStudent?.fullData?.student ||
        selectedStudent?.studentBasicDetails?.student_id ||
        selectedStudent?.student_id ||
        null;

      if (!studentId) {
        console.error("No valid student ID found in selected student");
        return;
      }

      // Store also in state
      setStudentId(studentId);

      // Also store in localStorage (optional)
      localStorage.setItem(
        "selectedClubStudentId",
        JSON.stringify({ student_id: studentId })
      );

      // Fetch full details
      await fetchStudentDetails(studentId);

      // Close modal
      handleCloseModal();
    } catch (error) {
      console.error("Error handling selected student:", error);
    }
  };

  const fetchStudentDetails = async (student_id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const organization_id = sessionStorage.getItem("organization_id");
      const branch_id = sessionStorage.getItem("branch_id");

      if (!student_id || !organization_id || !branch_id || !token) {
        console.error(" Missing identifiers for fetching student data");
        return;
      }

      const url = `${ApiUrl.apiurl}StudentCourse/GetStudentDataBasedId/?student_id=${student_id}&branch_id=${branch_id}&organization_id=${organization_id}`;
      console.log(" Fetching from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch student details");

      const result = await response.json();
      console.log("🔹 API Response:", result);

      if (result.message === "Success" && result.data) {
        const student = result.data;

        setStudentDetails(student);
        setStudentName(student.student_name || "");

        setSelectedStudent({
          name: student.student_name || "",
          barcode: student.barcode || "",
          admissionNo: student.college_admission_no || "",
        });

        setSelectedSession({
          value: student.batch_id,
          label: student.batch,
        });

        setSelectedCourse({
          value: student.course_id,
          label: student.course_name,
        });

        setSelectedDepartment({
          value: student.department_id,
          label: student.department,
        });

        setSelectedAcademicYear({
          value: student.academic_year_id,
          label: student.academic_year,
        });

        setSelectedSemester({
          value: student.semester_id,
          label: student.semester_name,
        });

        setSelectedSection({
          value: student.section_id,
          label: student.section_name,
        });
      } else {
        console.warn(" No data found for student_id:", student_id);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  // Fetch today's data on page load
  useEffect(() => {
    handleSearch();
  }, []);

  // You can adjust this to show more or fewer items per page
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Calculate data for the current page
  const offset = currentPage * receiptsPerPage;
  const currentReceipts = receiptsData.slice(offset, offset + receiptsPerPage);
  const pageCount = Math.ceil(receiptsData.length / receiptsPerPage);

  const formatDateToLocal = (date) => {
    if (!date) return "";

    const d = typeof date === "string" ? new Date(date) : date;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleClear = () => {
    //  Student related
    setSelectedStudent(null);
    setStudentId("");
    setStudentName("");
    setSelectedStudentIds([]);

    // 🔹 Dropdown filters
    setSelectedSession(null);
    setSelectedCourse(null);
    setSelectedDepartment(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);

    // 🔹 Class / Section IDs
    setClassId(null);
    setSectionId(null);

    //  Date filters - Reset to today's date
    setFormData({
      dateFrom: getTodayDate(),
      dateTo: getTodayDate(),
    });
    setStartDate(null);
    setEndDate(null);

    //  Other filters
    setReceiptNo("");
    setBank(null);
    setPeriod(null);
    setSelectedBank(null);
    setSelectedAccount(null);

    //  Table & pagination
    setShowTable(false);
    setReceiptsData([]);
    setReceipts([]);
    setSelectedReceipt(null);
    setCurrentPage(0);

    //  Radio button reset (optional)
    setViewOption("viewReceipts");

    //  Modals
    setShowModal(false);
    setShowUpdateModal(false);
    setShowCancelModal(false);
    setCancelRemark("");

    // Fetch today's data after clearing
    setTimeout(() => {
      handleSearch();
    }, 100);
  };


  const handleUpdateClick = async (receipt) => {
    const receiptId = receipt.receiptId;

    // Get student_id same way as handleSearch
    const storedStudent = localStorage.getItem("selectedClubStudentId");
    const studentIdValue = storedStudent
      ? JSON.parse(storedStudent).student_id
      : studentId;

    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");

    if (!receiptId) {
      alert("Receipt ID missing!");
      return;
    }

    try {
      const apiUrl = `${ApiUrl.apiurl}FeeReceipt/GetFeeReceiptBasedOnReceiptId/?organization_id=${organization_id}&branch_id=${branch_id}&receipt_id=${receiptId}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.data) {
        const receiptData = result.data;

        setSelectedReceipt({
          receiptId: receiptData.receiptId, // keep ID for update
          receiptDate: receiptData.receipt_date
            ? new Date(receiptData.receipt_date).toISOString().split("T")[0]
            : "",
          amount: receiptData.amount || "",
          referenceDate: receiptData.reference_date
            ? new Date(receiptData.reference_date).toISOString().split("T")[0]
            : "",
          paymentMethodId: receiptData.payment_methodId || null,
          bankId: receiptData.bankId || "",
          bankdetailsId: receiptData.bankdetailsId || "", // Store the account ID
          accountNumber: receiptData.bank_account || "", // Display value
          paymentReference: receiptData.payment_reference || "",
          studentId: studentIdValue, // Pass student id for update saving if needed
        });

        setShowUpdateModal(true);
      } else {
        alert("Unable to fetch receipt data.");
      }
    } catch (error) {
      console.error("Error fetching receipt data:", error);
    }
  };


  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedReceipt((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");

        if (!token) {
          console.error("Access token not found in localStorage.");
          return;
        }

        if (!organization_id || !branch_id) {
          console.error("Missing organization_id or branch_id");
          return;
        }

        const apiUrl = `${ApiUrl.apiurl}BANK/GetAllBankList/?organization_id=${organization_id}&branch_id=${branch_id}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Bank API Response:", result);

        if (result.message === "Success" && Array.isArray(result.data)) {
          const options = result.data.map((bank) => ({
            value: bank.id,
            label: bank.bank_name,
          }));
          setBankOptions(options);
        } else {
          setBankOptions([]);
          console.warn("Unexpected API response:", result);
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    if (selectedReceipt && selectedReceipt.bankId) {
      const fetchAccountDetails = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const organization_id = sessionStorage.getItem("organization_id");
          const branch_id = sessionStorage.getItem("branch_id");
          const selectedBankId = selectedReceipt.bankId;

          if (!token) {
            console.error("Access token missing.");
            return;
          }

          const apiUrl = `${ApiUrl.apiurl}AccountDetails/GetAccountDetailsBasedOnBankId/?organization_id=${organization_id}&branch_id=${branch_id}&bank_id=${selectedBankId}`;

          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const result = await response.json();

          if (
            response.ok &&
            result.message === "success!!" &&
            Array.isArray(result.data)
          ) {
            const accountOptions = result.data.map((account) => ({
              value: account.id, // Use account ID as value
              label: account.bank_account.toString(),
              accountNumber: account.bank_account, // Store account number for display
            }));
            setAccountDetails(accountOptions);
          } else {
            console.warn("Unexpected API response:", result);
            setAccountDetails([]);
          }
        } catch (error) {
          console.error("Error fetching account details:", error);
        }
      };

      fetchAccountDetails();
    } else {
      // Clear account details when no bank is selected
      setAccountDetails([]);
    }
  }, [selectedReceipt]);


  // Handle bank selection
  const handleBankSelect = (selectedOption) => {
    setSelectedReceipt((prevState) => ({
      ...prevState,
      bankId: selectedOption ? selectedOption.value : "",
      bankdetailsId: "", // Reset account when bank changes
      accountNumber: "",
    }));
  };

  // Handle account selection
  const handleAccountSelect = (selectedOption) => {
    setSelectedReceipt((prevState) => ({
      ...prevState,
      bankdetailsId: selectedOption ? selectedOption.value : "", // Store account ID
      accountNumber: selectedOption ? selectedOption.accountNumber : "", // Store account number for display
    }));
  };


  // const handleSearch = async () => {
  //   const storedStudent = localStorage.getItem("selectedClubStudentId");
  //   const studentIdValue = storedStudent
  //     ? JSON.parse(storedStudent).student_id
  //     : studentId;

  //   const organization_id = sessionStorage.getItem("organization_id");
  //   const branch_id = sessionStorage.getItem("branch_id");

  //   if (!studentIdValue) {
  //     alert("Please enter Student ID");
  //     return;
  //   }

  //   const formattedStartDate = formatDateToLocal(startDate);
  //   const formattedEndDate = formatDateToLocal(endDate);

  //   const apiUrl = `${ApiUrl.apiurl}FeeReceipt/GetFilterFeeReceipts/?organization_id=${organization_id}&branch_id=${branch_id}&student_id=${studentIdValue}${
  //     formattedStartDate ? `&date_from=${formattedStartDate}` : ""
  //   }${formattedEndDate ? `&date_to=${formattedEndDate}` : ""}&view_receipt=true`;

  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     });

  //     const result = await response.json();

  //     // ⬇️ FIX: Data comes from result.data
  //     if (response.ok && Array.isArray(result.data)) {
  //       setReceiptsData(result.data);
  //       setShowTable(true);
  //       setSelectedReceipt(result.data.length > 0 ? result.data[0] : null);
  //     } else {
  //       setReceiptsData([]);
  //       setShowTable(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setReceiptsData([]);
  //     setShowTable(false);
  //   }
  // };

  // const handleSearch = async () => {
  //   const organization_id = sessionStorage.getItem("organization_id");
  //   const branch_id = sessionStorage.getItem("branch_id");

  //   const formattedStartDate = formatDateToLocal(startDate);
  //   const formattedEndDate = formatDateToLocal(endDate);

  //   let apiUrl = `${ApiUrl.apiurl}FeeReceipt/GetFilterFeeReceipts/?organization_id=${organization_id}&branch_id=${branch_id}`;

  //   // Add student_id only if selected
  //   if (studentId) apiUrl += `&student_id=${studentId}`;

  //   // Add date filters
  //   if (formattedStartDate) apiUrl += `&date_from=${formattedStartDate}`;
  //   if (formattedEndDate) apiUrl += `&date_to=${formattedEndDate}`;

  //   // -----------------------------
  //   // View Options Logic
  //   // Default: viewOption = "viewReceipts"
  //   // -----------------------------
  //   const isViewReceipts = viewOption === "viewReceipts";
  //   const isViewCancel = viewOption === "viewCancelReceipts";

  //   apiUrl += `&view_receipt=${isViewReceipts}`;
  //   apiUrl += `&view_cancel_receipt=${isViewCancel}`;

  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     });

  //     const result = await response.json();

  //     if (response.ok && Array.isArray(result.data)) {
  //       setReceiptsData(result.data);
  //       setShowTable(true);
  //       setSelectedReceipt(result.data.length > 0 ? result.data[0] : null);
  //     } else {
  //       setReceiptsData([]);
  //       setShowTable(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setReceiptsData([]);
  //     setShowTable(false);
  //   }
  // };
  const handleSearch = async () => {
    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");

    // ✅ take dates from formData
    const formattedStartDate = formData.dateFrom
      ? formatDateToLocal(formData.dateFrom)
      : "";

    const formattedEndDate = formData.dateTo
      ? formatDateToLocal(formData.dateTo)
      : "";

    const params = new URLSearchParams({
      organization_id,
      branch_id,
    });

    // Optional filters
    if (studentId) params.append("student_id", studentId);
    if (formattedStartDate) params.append("date_from", formattedStartDate);
    if (formattedEndDate) params.append("date_to", formattedEndDate);

    // View options
    params.append("view_receipt", viewOption === "viewReceipts");
    params.append("view_cancel_receipt", viewOption === "viewCancelReceipts");

    const apiUrl = `${ApiUrl.apiurl
      }FeeReceipt/GetFilterFeeReceipts/?${params.toString()}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const result = await response.json();

      if (response.ok && Array.isArray(result.data)) {
        setReceiptsData(result.data);
        setShowTable(true);
        setSelectedReceipt(result.data.length > 0 ? result.data[0] : null);
      } else {
        setReceiptsData([]);
        setShowTable(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setReceiptsData([]);
      setShowTable(false);
    }
  };







  // Export to Excel function
  const exportToExcel = () => {
    if (receiptsData.length > 0) {
      const ws = XLSX.utils.json_to_sheet(receiptsData); // Convert JSON data to a worksheet
      const wb = XLSX.utils.book_new(); // Create a new workbook
      XLSX.utils.book_append_sheet(wb, ws, "Receipts"); // Append the worksheet to the workbook
      XLSX.writeFile(wb, "Receipts_Data.xlsx"); // Write the Excel file
    } else {
      alert("No data available to export!");
    }
  };

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");

        if (!token) {
          console.error("Access token not found in localStorage.");
          return;
        }

        if (!organization_id || !branch_id) {
          console.error("Missing organization_id or branch_id");
          return;
        }

        const apiUrl = `${ApiUrl.apiurl}PaymentMethod/GetAllPaymentMethodList/?organization_id=${organization_id}&branch_id=${branch_id}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Payment Method API Response:", result);

        if (result.message === "Success" && Array.isArray(result.data)) {
          const options = result.data.map((method) => ({
            value: method.id,
            label: method.payment_method,
          }));
          setPaymentMethodOptions(options);
        } else {
          setPaymentMethodOptions([]);
          console.warn("Unexpected API response:", result);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Modal handling functions
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleOptionChange = (event) => {
    setViewOption(event.target.value);
    setShowTable(false); // Reset table view when switching options
  };

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const organization_id = sessionStorage.getItem("organization_id");
        const branch_id = sessionStorage.getItem("branch_id");

        const batch_id = selectedSession?.value || "";
        const course_id = selectedCourse?.value || "";
        const department_id = selectedDepartment?.value || "";

        if (!batch_id || !course_id || !department_id) {
          setSemesterOptions([]);
          return;
        }

        const response = await fetch(
          `${ApiUrl.apiurl}Semester/GetSemesterByDepartment/?organization_id=${organization_id}&branch_id=${branch_id}&batch_id=${batch_id}&course_id=${course_id}&department_id=${department_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (Array.isArray(data)) {
          setSemesterOptions(
            data.map((item) => ({
              value: item.id,
              label: item.semester_description || item.semester_code,
            }))
          );
        } else {
          console.error("Unexpected semester API response:", data);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    };

    fetchSemesters();
  }, [selectedSession, selectedCourse, selectedDepartment]);


  useEffect(() => {
    const fetchSectionData = async () => {
      if (!classId) {
        setSectionOptions([]); // Clear sections if no class selected
        return;
      }

      console.log("Fetching sections for classId:", classId); // Debugging

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}ClassSectionBind/GetAllSectionBindWithClass/${classId}`
        );
        const data = await response.json();

        console.log("Section API response:", data); // Debugging

        if (data.message === "success") {
          const formattedSections = data.data.map((sectionItem) => ({
            value: sectionItem.id,
            label: sectionItem.sectionname,
          }));
          setSectionOptions(formattedSections);
        } else {
          console.error("Failed to fetch sections: ", data.message);
          setSectionOptions([]);
        }
      } catch (error) {
        console.error("Error fetching section data:", error);
        setSectionOptions([]);
      }
    };

    fetchSectionData();
  }, [classId]);

  // Function to handle closing the modal
  const handleCloseReceiptModal = () => {
    setShowUpdateModal(false); // Hide the modal
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    setSelectedReceipt({
      ...selectedReceipt,
      [fieldName]: selectedOption ? selectedOption.value : "", // Update the selected field with the chosen value
    });
  };

  // Function to handle the Cancel link click
  const handleCancelClick = (e, receipt) => {
    e.preventDefault();
    setSelectedReceipt(receipt);
    setShowCancelModal(true);
  };

  const handleSaveUpdate = async () => {
    if (!selectedReceipt || !selectedReceipt.receiptId) {
      console.error("Receipt ID is missing.");
      alert("Receipt ID is missing.");
      return;
    }

    const receiptId = selectedReceipt.receiptId;
    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");

    // Ensure we have the payment method value (number)
    const paymentMethod = selectedReceipt.paymentMethodId ?? null;

    // Validate required fields before sending
    if (!selectedReceipt.receiptDate || !paymentMethod) {
      console.error("Missing required receipt_date or payment_method", {
        receiptDate: selectedReceipt.receiptDate,
        paymentMethod,
      });
      alert("Please fill receipt date and payment method before saving.");
      return;
    }

    // If payment method indicates cash (example: 2), do not send bank info
    const isCash = Number(paymentMethod) === 2;

    const requestBody = {
      receipt_date: selectedReceipt.receiptDate, // yyyy-mm-dd string expected
      payment_method: Number(paymentMethod),
      payment_reference: selectedReceipt.paymentReference || "",
      reference_date: selectedReceipt.referenceDate || null,
      bank_id: isCash
        ? null
        : selectedReceipt.bankId
          ? Number(selectedReceipt.bankId)
          : null,
      account_number: isCash
        ? null
        : selectedReceipt.bankdetailsId
          ? Number(selectedReceipt.bankdetailsId)
          : null,
    };

    // Final check: API wants integers for bank_id/account_number if provided
    // If API requires 0 instead of null for missing values, change null -> 0

    try {
      const apiUrl = `${ApiUrl.apiurl}FeeReceipt/UpdatePaymentDetailBasedOnReceipt/?organization_id=${organization_id}&branch_id=${branch_id}&receipt_id=${receiptId}`;

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (
        response.ok &&
        (data.message?.toLowerCase().includes("success") ||
          data.message === "payment receipt Update successfully!!")
      ) {
        alert("Receipt updated successfully!");
        setShowUpdateModal(false);
      } else {
        console.error("Update failed:", data);
        alert(data.message || "Failed to update receipt.");
      }
    } catch (error) {
      console.error("Error updating receipt:", error);
      alert("There was an error updating the receipt.");
    }
  };



  const handleCancelSave = async () => {
    if (!cancelRemark) {
      alert("Please provide a cancel remark.");
      return;
    }

    const data = {
      organization_id: sessionStorage.getItem("organization_id"),
      branch_id: sessionStorage.getItem("branch_id"),
      receipt_id: selectedReceipt.receiptId, // API expects 'receipt_id'
      cancel_remark: cancelRemark, // API expects 'cancel_remark'
    };

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}FeeReceipt/FeeReceiptsCancelCreate/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Receipt cancelled successfully!");
        setReceiptsData((prev) =>
          prev.filter((item) => item.receiptId !== selectedReceipt.receiptId)
        );
        setShowCancelModal(false);
        setSelectedReceipt(null);
        setCancelRemark("");
      } else {
        alert(result.message || "Failed to cancel receipt.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again.");
    }
  };


  // Function to handle clearing fields (optional)
  const handleCancelClear = () => {
    setCancelRemark("");
  };

  // Function to close the modal without saving
  const handleCancelCloseButton = () => {
    setShowCancelModal(false);
    setSelectedReceipt(null);
    setCancelRemark("");
  };

  const handleReceiptLinkClick = async (receiptNo) => {
    const organization_id = sessionStorage.getItem("organization_id");
    const branch_id = sessionStorage.getItem("branch_id");

    if (!organization_id || !branch_id) {
      alert("Organization or Branch ID missing.");
      return;
    }

    try {
      const response = await fetch(
        `${ApiUrl.apiurl}FeeReceipt/GetFeeReceiptsBasedOnReceiptNo/?organization_id=${organization_id}&branch_id=${branch_id}&receipt_no=${receiptNo}`
      );
      const result = await response.json();

      if (response.ok && result.receipt_data) {
        const data = result.receipt_data;
        const doc = new jsPDF("portrait", "mm", "a4");

        // LOGO LOAD
        const toBase64 = (url) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              canvas.getContext("2d").drawImage(img, 0, 0);
              resolve(canvas.toDataURL("image/jpeg"));
            };
            img.onerror = reject;
            img.src = url;
          });

        try {
          const sparshLogo = await toBase64("/Assets/sparsh.jpeg");
          doc.addImage(sparshLogo, "JPEG", 10, 10, 20, 20);
        } catch { }

        // HEADER
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        const headerText = "Sparsh College of Nursing and Allied Sciences";
        const textWidth =
          (doc.getStringUnitWidth(headerText) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        doc.text(headerText, (pageWidth - textWidth) / 2, 22);
        doc.setFontSize(12);
        doc.text("Fee Receipt", pageWidth / 2, 30, { align: "center" });

        // RECEIPT DETAILS
        const receiptDetails = [
          ["Receipt No", data.receipt_no, "Section", data.section_name],
          [
            "Receipt Date",
            data.receipt_date?.split("T")[0],
            "Father's Name",
            data.father_name,
          ],
          [
            "Student Name",
            Array.isArray(data.student_name)
              ? data.student_name.join(" ")
              : typeof data.student_name === "object" &&
                data.student_name !== null
                ? Object.values(data.student_name).join(" ")
                : data.student_name || "",
            "Fee Period",
            Array.isArray(data.fee_semesters)
              ? data.fee_semesters.join(", ")
              : typeof data.fee_semesters === "object" &&
                data.fee_semesters !== null
                ? Object.values(data.fee_semesters).join(", ")
                : data.fee_semesters || "",
          ],

          ["Admission No", data.admission_no, "Amount", data.amount.toFixed(2)],
          ["Class", `${data.course_name} - ${data.semester_name}`, "", ""],
        ];

        doc.autoTable({
          startY: 35,
          body: receiptDetails,
          theme: "grid",
          styles: { fontSize: 11, fontStyle: "bold" },
          margin: { left: 15 },
          tableWidth: 180,
        });

        // FEE ELEMENT TABLE
        const feeElements = Object.values(data.payment_element_list).map(
          (el, index) => [index + 1, el.element_name, el.amount.toFixed(2)]
        );
        feeElements.push(["", "Total", data.amount.toFixed(2)]);

        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 8,
          head: [["Sr. No.", "Element", "Amount"]],
          body: feeElements,
          theme: "grid",
          styles: { fontSize: 11, fontStyle: "bold" },
          columnStyles: { 2: { halign: "right" } },
          margin: { left: 15 },
          tableWidth: 180,
        });

        // PAYMENT METHOD TABLE
        const paymentData = [
          [
            data.payment_method,
            data.payment_reference || "-",
            data.remarks || "-",
            data.amount.toFixed(2),
          ],
        ];

        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 8,
          head: [["Payment Method", "Payment Reference", "Remark", "Amount"]],
          body: paymentData,
          theme: "grid",
          styles: { fontSize: 11, fontStyle: "bold" },
          columnStyles: { 3: { halign: "right" } },
          margin: { left: 15 },
          tableWidth: 180,
        });

        // SUMMARY TABLE
        const summary = [
          ["Total Session Fee", data.total_academic_year_fees.toFixed(2)],
          ["Total Paid", data.total_paid.toFixed(2)],
          ["Total Balance", data.remaining_amount.toFixed(2)],
        ];

        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 8,
          body: summary,
          theme: "grid",
          styles: { fontSize: 11, fontStyle: "bold" },
          columnStyles: { 1: { halign: "right" } },
          margin: { left: 15 },
          tableWidth: 180,
        });

        // OPEN PDF
        const pdfBlob = doc.output("blob");
        window.open(URL.createObjectURL(pdfBlob), "_blank");
      } else {
        alert(result.message || "Unable to load receipt.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again.");
    }
  };


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <p
                style={{
                  marginBottom: "0px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                FEE SEARCH
              </p>

              {/* Adding a border around all buttons */}
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleNewClick}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSearch}
                  >
                    Search
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
                    onClick={() => navigate("/admin/dashboard")}

                  // onClick={handleCloseButton}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={exportToExcel}
                  >
                    Export to Excel
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-md-3 mb-3">
                        <label htmlFor="period" className="form-label">
                          Period
                        </label>
                        <Select
                          className="detail"
                          options={semesterOptions} // ← FIXED
                          placeholder="Select Period"
                          isClearable
                          value={
                            period
                              ? semesterOptions.find(
                                (option) => option.value === period
                              )
                              : null
                          }
                          onChange={(selectedOption) =>
                            setPeriod(selectedOption?.value || null)
                          }
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <label htmlFor="student-name" className="form-label">
                          Student Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            className="form-control detail"
                            placeholder="Enter student name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-primary ms-2 mb-0 mt-0"
                            onClick={handleOpenModal}
                            style={{ width: "50px", padding: "3px" }}
                          >
                            ...
                          </button>
                        </div>

                        <SelectStudentFeeModal
                          show={showModal}
                          handleClose={handleCloseModal}
                          onSelectStudent={handleSelectStudent}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <label htmlFor="receipt-no" className="form-label">
                          ReceiptNO
                        </label>
                        <input
                          type="text"
                          className="form-control detail"
                          placeholder="Enter Receipt No"
                          value={receiptNo}
                          onChange={(e) => setReceiptNo(e.target.value)}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="class" className="form-label">
                          Session
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="session"
                            className="form-control detail"
                            placeholder="Enter Session"
                            value={selectedSession?.label || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="class" className="form-label">
                          Course
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="course"
                            className="form-control detail"
                            placeholder="Enter Course"
                            value={selectedCourse?.label || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="roll-no" className="form-label">
                          Department
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="branch"
                            className="form-control detail"
                            placeholder="Enter Branch"
                            value={selectedDepartment?.label || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="roll-no" className="form-label">
                          Academic Year
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="academic-year"
                            className="form-control detail"
                            placeholder="Enter Academic Year"
                            value={selectedAcademicYear?.label || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="roll-no" className="form-label">
                          Semester
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="semester"
                            className="form-control detail"
                            placeholder="Enter Semester"
                            value={selectedSemester?.label || ""}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="section" className="form-label">
                          Section
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="period"
                            className="form-control detail"
                            placeholder="Enter section"
                            value={selectedSection?.label || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label
                          htmlFor="date-from"
                          className="form-label fw-bold"
                        >
                          Date From
                        </label>
                        <input
                          type="date"
                          id="date-from"
                          className="form-control detail"
                          value={formData.dateFrom}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dateFrom: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="date-to" className="form-label fw-bold">
                          Date To
                        </label>
                        <input
                          type="date"
                          id="date-to"
                          className="form-control detail"
                          value={formData.dateTo}
                          onChange={(e) =>
                            setFormData({ ...formData, dateTo: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-md-3 radio-buttons mb-3 mt-4">
                        <label>
                          <input
                            type="radio"
                            name="viewOption"
                            value="viewReceipts"
                            checked={viewOption === "viewReceipts"}
                            onChange={handleOptionChange}
                          />
                          View Receipts
                        </label>
                        <label className="ms-3">
                          <input
                            type="radio"
                            name="viewOption"
                            value="viewCancelReceipts"
                            checked={viewOption === "viewCancelReceipts"}
                            onChange={handleOptionChange}
                          />
                          View Cancel Receipts
                        </label>
                      </div>

                      {/* <div className="col-md-3 mb-3">
                        <label style={{ fontWeight: "700" }}>Fee Due</label>
                        <div className="fee-search-page-fee-due-box">
                          <input
                            type="checkbox"
                            style={{ fontWeight: "700" }}
                          />{" "}
                          Fees Due
                          <br />
                          <input
                            type="checkbox"
                            name="feeDetail"
                            style={{ fontWeight: "700" }}
                          />{" "}
                          Summary
                          <br />
                          <input
                            type="checkbox"
                            name="feeDetail"
                            defaultChecked
                            style={{ fontWeight: "700" }}
                          />{" "}
                          Detail (Fee Element Wise)
                          <Select
                            className="mt-2"
                            options={[
                              { value: "option1", label: "Option 1" },
                              { value: "option2", label: "Option 2" },
                            ]}
                            placeholder="Select"
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>

              {showTable && viewOption === "viewReceipts" && (
                <div className="fee-details-table mt-4">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr No</th>
                          <th>Period</th>
                          <th>Name</th>
                          <th>Father's Name</th>
                          <th>Course</th>
                          <th>Section</th>
                          <th>Bar Code No</th>
                          <th>College Admission No</th>
                          <th>Receipt Date</th>
                          <th>Receipt Amount</th>
                          <th>Discount Amount</th>
                          <th>Receipt No</th>
                          <th>Update</th>
                          <th>Cancel</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receiptsData.map((receipt, index) => (
                          <tr key={receipt.receiptId}>
                            <td>{index + 1}</td>
                            <td>{receipt.semester_description}</td>
                            <td>{receipt.student_name}</td>
                            <td>{receipt.father_name}</td>
                            <td>{receipt.course_name}</td>
                            <td>{receipt.section_name}</td>
                            <td>{receipt.barcode}</td>
                            <td>{receipt.college_admission_no}</td>
                            <td>
                              {new Date(
                                receipt.receiptDate
                              ).toLocaleDateString()}
                            </td>
                            <td>{receipt.amount}</td>
                            <td>{receipt.discount_amount}</td>
                            <td>
                              <a
                                href="#"
                                onClick={() =>
                                  handleReceiptLinkClick(receipt.receipt_no)
                                }
                              >
                                RC{receipt.receipt_no}
                              </a>
                            </td>
                            <td>
                              <a
                                href="#"
                                className="text-warning"
                                onClick={() => handleUpdateClick(receipt)}
                              >
                                Update
                              </a>
                            </td>
                            <td>
                              <a
                                href={`/cancel-receipt/${receipt.receiptId}`}
                                className="text-danger"
                                onClick={(e) => handleCancelClick(e, receipt)}
                              >
                                Cancel
                              </a>
                            </td>

                            <td>{receipt.cancellation_remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </div>
              )}

              {/* Cancel Modal */}
              {showCancelModal && selectedReceipt && (
                <div
                  className="modal show"
                  style={{ display: "block" }}
                  tabIndex="-1"
                  role="dialog"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Cancel Receipt</h5>
                      </div>
                      <div className="modal-body">
                        {/* Buttons at the top */}
                        <div className="row mb-2">
                          <div
                            className="col-12"
                            style={{ border: "1px solid #ccc" }}
                          >
                            <button
                              type="button"
                              className="btn btn-primary me-2"
                              style={{
                                "--bs-btn-padding-y": ".25rem",
                                "--bs-btn-padding-x": ".5rem",
                                "--bs-btn-font-size": ".75rem",
                                width: "150px",
                              }}
                              onClick={handleCancelSave} // Updated function name
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary me-2"
                              style={{
                                "--bs-btn-padding-y": ".25rem",
                                "--bs-btn-padding-x": ".5rem",
                                "--bs-btn-font-size": ".75rem",
                                width: "150px",
                              }}
                              onClick={handleCancelClear}
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger me-2"
                              style={{
                                "--bs-btn-padding-y": ".25rem",
                                "--bs-btn-padding-x": ".5rem",
                                "--bs-btn-font-size": ".75rem",
                                width: "150px",
                              }}
                              onClick={handleCancelCloseButton}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                        {/* Remark Field */}
                        <div className="form-group mt-3">
                          <label htmlFor="remark">Remark</label>
                          <textarea
                            id="remark"
                            className="form-control detail"
                            rows="3"
                            value={cancelRemark} // Bind remark value to state
                            onChange={(e) => setCancelRemark(e.target.value)} // Update state on input change
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showUpdateModal && selectedReceipt && (
                <div
                  className="modal show"
                  style={{ display: "block" }}
                  tabIndex="-1"
                  role="dialog"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Update Receipt</h5>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="form-group">
                            <label>Receipt Date</label>
                            <input
                              type="date"
                              className="form-control detail"
                              name="receiptDate"
                              value={selectedReceipt.receiptDate}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="form-group">
                            <label>Amount</label>
                            <input
                              type="number"
                              className="form-control detail"
                              name="amount"
                              value={selectedReceipt.amount}
                              onChange={handleInputChange}
                              disabled
                            />
                          </div>

                          {/* Reference Date Field */}
                          <div className="form-group">
                            <label>Reference Date</label>
                            <input
                              type="date"
                              className="form-control detail"
                              name="referenceDate"
                              value={selectedReceipt.referenceDate}
                              onChange={handleInputChange}
                            />
                          </div>

                          {/* Payment Method */}
                          <div className="form-group">
                            <label
                              htmlFor="paymentMethod"
                              className="form-label"
                            >
                              Payment Method
                            </label>
                            <Select
                              options={paymentMethodOptions}
                              classNamePrefix="react-select"
                              placeholder="Select Payment Method"
                              value={
                                paymentMethodOptions.find(
                                  (option) =>
                                    option.value ===
                                    selectedReceipt.paymentMethodId
                                ) || null
                              }
                              onChange={(selectedOption) => {
                                const selectedValue = selectedOption
                                  ? selectedOption.value
                                  : null;

                                // Find the label of the selected payment method
                                const selectedLabel = selectedOption
                                  ? selectedOption.label?.toLowerCase()
                                  : "";

                                // Reset bank and account when payment method changes
                                setSelectedReceipt((prev) => ({
                                  ...prev,
                                  paymentMethodId: selectedValue,
                                  paymentMethodLabel: selectedLabel, // Store label for conditional rendering
                                  // Reset bank and account for ALL payment method changes
                                  bankId: selectedLabel === "cash" ? null : null,
                                  bankdetailsId: null,
                                  accountNumber: "",
                                }));

                                // Clear account details when payment method changes
                                setAccountDetails([]);

                                // Clear all payment-specific fields
                                setChequeNumber("");
                                setChequeBankName("");
                                setChequeBranchName("");
                                setDdNumber("");
                                setDdIssuingBank("");
                                setUpiUtrNo("");
                                setRtgsUtrNo("");
                                setRtgsSenderBank("");
                                setRtgsAccountNo("");
                              }}
                            />
                          </div>

                          {/* Cheque Fields */}
                          {selectedReceipt.paymentMethodLabel === "cheque" && (
                            <>
                              <div className="form-group">
                                <label className="form-label">Cheque Number</label>
                                <input
                                  type="text"
                                  className="form-control detail"
                                  value={chequeNumber}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 6) setChequeNumber(value);
                                  }}
                                  maxLength="6"
                                  placeholder="Enter Cheque Number (6 digits)"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Cheque Bank Name</label>
                                <input
                                  type="text"
                                  className="form-control detail"
                                  value={chequeBankName}
                                  onChange={(e) => setChequeBankName(e.target.value)}
                                  placeholder="Cheque Bank Name"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Cheque Branch Name</label>
                                <input
                                  type="text"
                                  className="form-control detail"
                                  value={chequeBranchName}
                                  onChange={(e) => setChequeBranchName(e.target.value)}
                                  placeholder="Cheque Branch Name"
                                />
                              </div>
                            </>
                          )}

                          {/* DD Fields */}
                          {selectedReceipt.paymentMethodLabel === "dd" && (
                            <>
                              <div className="form-group">
                                <label className="form-label">DD Number</label>
                                <input
                                  type="text"
                                  className="form-control detail"
                                  value={ddNumber}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 6) setDdNumber(value);
                                  }}
                                  maxLength="6"
                                  placeholder="Enter DD Number (6 digits)"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Issuing Bank</label>
                                <input
                                  type="text"
                                  className="form-control detail"
                                  value={ddIssuingBank}
                                  onChange={(e) => setDdIssuingBank(e.target.value)}
                                  placeholder="Issuing Bank"
                                />
                              </div>
                            </>
                          )}

                          {/* UPI Fields */}
                          {selectedReceipt.paymentMethodLabel?.includes("upi") && (
                            <div className="form-group">
                              <label className="form-label">UTR No</label>
                              <input
                                type="text"
                                className="form-control detail"
                                value={upiUtrNo}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  if (value.length <= 22) setUpiUtrNo(value);
                                }}
                                maxLength="22"
                                placeholder="Enter UTR No (22 digits)"
                              />
                            </div>
                          )}

                          {/* RTGS/NEFT Fields */}
                          {(selectedReceipt.paymentMethodLabel?.includes("rtgs") ||
                            selectedReceipt.paymentMethodLabel?.includes("neft")) && (
                              <>
                                <div className="form-group">
                                  <label className="form-label">UTR No</label>
                                  <input
                                    type="text"
                                    className="form-control detail"
                                    value={rtgsUtrNo}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, '');
                                      if (value.length <= 22) setRtgsUtrNo(value);
                                    }}
                                    maxLength="22"
                                    placeholder="Enter UTR No (22 digits)"
                                  />
                                </div>

                                <div className="form-group">
                                  <label className="form-label">Sender Bank</label>
                                  <input
                                    type="text"
                                    className="form-control detail"
                                    value={rtgsSenderBank}
                                    onChange={(e) => setRtgsSenderBank(e.target.value)}
                                    placeholder="Sender Bank"
                                  />
                                </div>

                                <div className="form-group">
                                  <label className="form-label">Account No</label>
                                  <input
                                    type="text"
                                    className="form-control detail"
                                    value={rtgsAccountNo}
                                    onChange={(e) => setRtgsAccountNo(e.target.value)}
                                    placeholder="Account No"
                                  />
                                </div>
                              </>
                            )}

                          {/* Bank Name Dropdown */}
                          <div className="form-group">
                            <label>Bank</label>
                            <Select
                              className="react-select"
                              classNamePrefix="react-select"
                              name="bankId"
                              value={
                                bankOptions.find(
                                  (bank) =>
                                    bank.value === selectedReceipt.bankId
                                ) || null
                              }
                              onChange={handleBankSelect}
                              options={bankOptions}
                              placeholder="Select Bank"
                              isClearable
                              isDisabled={
                                paymentMethodOptions.find(
                                  (option) => option.value === selectedReceipt.paymentMethodId
                                )?.label?.toLowerCase() === "cash"
                              }
                            />
                          </div>

                          {/* Account Number Dropdown */}
                          <div className="form-group">
                            <label>Account Number</label>
                            <Select
                              className="react-select"
                              classNamePrefix="react-select"
                              name="accountNumber"
                              value={
                                accountDetails.find(
                                  (account) => account.value === selectedReceipt.bankdetailsId
                                ) || null
                              }
                              onChange={handleAccountSelect}
                              options={accountDetails}
                              placeholder="Select Account"
                              isClearable
                              isDisabled={
                                paymentMethodOptions.find(
                                  (option) => option.value === selectedReceipt.paymentMethodId
                                )?.label?.toLowerCase() === "cash"
                              }
                            />
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={handleCloseReceiptModal}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSaveUpdate}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showTable && viewOption === "viewCancelReceipts" && (
                <div className="cancelled-receipts-table mt-4">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr No</th>
                          <th>Period</th>
                          <th>Name</th>
                          <th>Father's Name</th>
                          <th>Class</th>
                          <th>Section</th>
                          <th>Bar Code No</th>
                          <th>School Admission No</th>
                          <th>Receipt Date</th>
                          <th>Receipt Amount</th>
                          <th>Discount Amount</th>
                          <th>Receipt No</th>
                          <th>Cancellation Remarks</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentReceipts.map((receipt, index) => (
                          <tr key={receipt.receiptId}>
                            <td>{index + 1}</td>
                            <td>{receipt.semester_description}</td>
                            <td>{receipt.student_name}</td>
                            <td>{receipt.father_name}</td>
                            <td>{receipt.course_name}</td>
                            <td>{receipt.section_name}</td>
                            <td>{receipt.barcode}</td>
                            <td>{receipt.college_admission_no}</td>
                            <td>
                              {new Date(
                                receipt.receiptDate
                              ).toLocaleDateString()}
                            </td>
                            <td>{receipt.amount}</td>
                            <td>{receipt.discount_amount}</td>
                            <td>RC{receipt.receipt_no}</td>
                            <td>{receipt.cancellation_remarks}</td>
                            <td>{receipt.payment_reference}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeSearchPage;