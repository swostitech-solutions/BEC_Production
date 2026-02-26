// import React, { useRef, useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
// import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { FaPlus } from "react-icons/fa";
// import DatePicker from "react-datepicker";
// import { ApiUrl } from "../../../ApiUrl";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// const FeeCollection = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedStudentId, setSelectedStudentId] = useState(null);
//   const [lateFeeAmount, setLateFeeAmount] = useState(0);
//   const [chequeBounceAmount, setChequeBounceAmount] = useState(0);
//   const [reAdmissionAmount, setReAdmissionAmount] = useState(0);
//   const [amount, setAmount] = useState(0); // Track the payment amount
//   const [balance, setBalance] = useState(0);
//   const [bank, setBank] = useState(null);
//   const [bankOptions, setBankOptions] = useState([]);

//   const [selectedAmount, setSelectedAmount] = useState(0); // State to store the selected "Due" value

//   const [lateFee, setLateFee] = useState(0);
//   const [reAdmission, setReAdmission] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [chequeBounce, setChequeBounce] = useState(0);
//   const [selectedBankId, setSelectedBankId] = useState(null);
//   const [accountNumberOptions, setAccountNumberOptions] = useState([]);
//   const [selectedAccountId, setSelectedAccountId] = useState(null);
//   const [selectedPeriods, setSelectedPeriods] = useState([]);
//   const [selectedFeeDetails, setSelectedFeeDetails] = useState([]);
//   const [totalDues, setTotalDues] = useState(0);
//   const [totalOtherCharges, setTotalOtherCharges] = useState(0);
//   const [lateFeeEnabled, setLateFeeEnabled] = useState(false);
//   const [reAdmissionEnabled, setReAdmissionEnabled] = useState(false);
//   const [discountEnabled, setDiscountEnabled] = useState(false);
//   const [uniquePeriods, setUniquePeriods] = useState([]);
//   const [chequeBounceEnabled, setChequeBounceEnabled] = useState(false);
//   const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
//   const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
//   const [studentBarcode, setStudentBarcode] = useState("");
//   const [schoolAdmissionNo, setSchoolAdmissionNo] = useState("");
//   const [studentName, setStudentName] = useState("");
//   const [className, setClassName] = useState("");
//   const [section, setSection] = useState("");
//   const [rollNo, setRollNo] = useState("");
//   const [feeGroup, setFeeGroup] = useState("");
//   const [selectedSection, setSelectedSection] = useState();
//   const [selectedSemester, setSelectedSemester] = useState();
//   const [selectedAcademicYear, setSelectedAcademicYear] = useState();
//   const [selectedDepartment, setSelectedDepartment] = useState();
//   const [selectedCourse, setSelectedCourse] = useState();
//   const [selectedSession, setSelectedSession] = useState();
//   const [studentDetails, setStudentDetails] = useState();
//   // const [charges, setCharges] = useState({
//   //   lateFee: 0,
//   //   readmission: 0,
//   //   discount: 0,
//   //   chequeBounce: 0,
//   // });

//   const [charges, setCharges] = useState({});
//   useEffect(() => {
//     const computedTotalDues = selectedFeeDetails.reduce(
//       (sum, detail) => sum + (detail.balance || 0),
//       0
//     );
//     setTotalDues(computedTotalDues);
//   }, [selectedFeeDetails]);

// useEffect(() => {
//   const computedTotalOtherCharges = Object.entries(charges).reduce(
//     (acc, [key, val]) => {
//       const value = parseFloat(val || 0);

//       // ✅ ONLY discount should subtract
//       if (key === "discount_fee") {
//         return acc - value;
//       }

//       // ✅ All others add
//       return acc + value;
//     },
//     0
//   );

//   setTotalOtherCharges(computedTotalOtherCharges);
// }, [charges]);


//   const [paidAmount, setPaidAmount] = useState(totalDues + totalOtherCharges);
//   const [isUserInput, setIsUserInput] = useState(false);
//   const [remark, setRemark] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [elementNameOptions, setElementNameOptions] = useState([]);
//   const [expandedRow, setExpandedRow] = useState(null);
//   const handleRowClick = (index) => {
//     setExpandedRow(expandedRow === index ? null : index); // Toggle row expansion
//   };
//   const [selectedStudent, setSelectedStudent] = useState({
//     studentId: "",
//     name: "",
//     barcode: "",
//     admissionNo: "",
//     class: "",
//     section: "",
//   });

//   const [feeDetails, setFeeDetails] = useState([]);

//   const [aggregatedFeeDetails, setAggregatedFeeDetails] = useState([]);
//   const [selectedPeriod, setSelectedPeriod] = useState(null);

//   const handleClear = () => {
//     // RESET SELECTION STATES
//     setSelectedFeeDetails([]);
//     setSelectedPeriods([]);
//     setSelectedPeriod(null);
//     setExpandedRow(null);

//     // RESET AMOUNT AND CHARGES
//     setTotalDues(0);
//     setTotalOtherCharges(0);
//     setPaidAmount(0);
//     setIsUserInput(false);
//     setAmount(0);
//     setBalance(0);

//     setCharges({
//       lateFee: 0,
//       readmission: 0,
//       discount: 0,
//       chequeBounce: 0,
//     });

//     setLateFeeAmount(0);
//     setChequeBounceAmount(0);
//     setReAdmissionAmount(0);
//     setLateFee(0);
//     setChequeBounce(0);
//     setReAdmission(0);
//     setDiscount(0);

//     // BANK & PAYMENT — do NOT clear options, only reset selected values
//     setSelectedBankId(null);
//     setSelectedAccountId(null);
//     setSelectedPaymentMethodId(null);
//     setBank(null);

//     // STUDENT DETAILS
//     setSelectedStudent({
//       studentId: "",
//       name: "",
//       barcode: "",
//       admissionNo: "",
//       class: "",
//       section: "",
//     });

//     setStudentBarcode("");
//     setSchoolAdmissionNo("");
//     setStudentName("");
//     setClassName("");
//     setSection("");
//     setRollNo("");
//     setFeeGroup("");

//     // DROPDOWN SELECTED VALUES (not the options!)
//     setSelectedSection(null);
//     setSelectedSemester(null);
//     setSelectedAcademicYear(null);
//     setSelectedDepartment(null);
//     setSelectedCourse(null);
//     setSelectedSession(null);

//     // TABLE DATA (only selected items)
//     setFeeDetails([]); // If needed
//     setAggregatedFeeDetails([]);
//     setUniquePeriods([]);

//     // UI RESET
//     setShowModal(false);
//     setElementNameOptions([]);
//     setRemark("");

//     // Reset date if needed
//     setSelectedDate(new Date());
//   };

//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         const response = await fetch(`${ApiUrl.apiurl}BANK/GetAllBankList/`);
//         const result = await response.json();

//         if (result.message === "Success") {
//           // Map API response to the format React Select needs
//           const options = result.data.map((bank) => ({
//             value: bank.id, // Bank ID as the value
//             label: bank.bankname, // Bank name as the label
//           }));
//           setBankOptions(options);
//         } else {
//           console.error("Failed to fetch banks:", result.message);
//         }
//       } catch (error) {
//         console.error("Error fetching banks:", error);
//       }
//     };

//     fetchBanks();
//   }, []);

//   useEffect(() => {
//     const fetchAccountDetails = async () => {
//       if (!selectedBankId) return; // Do nothing if no bank is selected

//       try {
//         const response = await fetch(
//           `${ApiUrl.apiurl}Account_Details/GetAccountDetailsBasedOnBankId/${selectedBankId}/`
//         );
//         const result = await response.json();

//         if (result.message === "success!!") {
//           // Map API response to the format React Select needs
//           const options = result.data.map((account) => ({
//             value: account.id, // Account ID as the value
//             label: `${account.bank_account}`, // Account number as the label
//           }));
//           setAccountNumberOptions(options);
//         } else {
//           console.error("Failed to fetch account details:", result.message);
//         }
//       } catch (error) {
//         console.error("Error fetching account details:", error);
//       }
//     };

//     fetchAccountDetails();
//   }, [selectedBankId]);

//   useEffect(() => {
//     const fetchPaymentMethods = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const organization_id = sessionStorage.getItem("organization_id");
//         const branch_id = sessionStorage.getItem("branch_id");

//         if (!token) {
//           console.error("Access token not found in localStorage.");
//           return;
//         }

//         if (!organization_id || !branch_id) {
//           console.error("Missing organization_id or branch_id");
//           return;
//         }

//         const apiUrl = `${ApiUrl.apiurl}PaymentMethod/GetAllPaymentMethodList/?organization_id=${organization_id}&branch_id=${branch_id}`;

//         const response = await fetch(apiUrl, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log("Payment Method API Response:", result);

//         if (result.message === "Success" && Array.isArray(result.data)) {
//           const options = result.data.map((method) => ({
//             value: method.id,
//             label: method.payment_method,
//           }));
//           setPaymentMethodOptions(options);
//         } else {
//           setPaymentMethodOptions([]);
//           console.warn("Unexpected API response:", result);
//         }
//       } catch (error) {
//         console.error("Error fetching payment methods:", error);
//       }
//     };

//     fetchPaymentMethods();
//   }, []);

//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const organization_id = sessionStorage.getItem("organization_id");
//         const branch_id = sessionStorage.getItem("branch_id");

//         if (!token) {
//           console.error("Access token not found in localStorage.");
//           return;
//         }

//         if (!organization_id || !branch_id) {
//           console.error("Missing organization_id or branch_id");
//           return;
//         }

//         const apiUrl = `${ApiUrl.apiurl}BANK/GetAllBankList/?organization_id=${organization_id}&branch_id=${branch_id}`;

//         const response = await fetch(apiUrl, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log("Bank API Response:", result);

//         if (result.message === "Success" && Array.isArray(result.data)) {
//           const options = result.data.map((bank) => ({
//             value: bank.id,
//             label: bank.bank_name,
//           }));
//           setBankOptions(options);
//         } else {
//           setBankOptions([]);
//           console.warn("Unexpected API response:", result);
//         }
//       } catch (error) {
//         console.error("Error fetching banks:", error);
//       }
//     };

//     fetchBanks();
//   }, []);

//   useEffect(() => {
//     const fetchAccountDetails = async () => {
//       if (!selectedBankId) {
//         setAccountNumberOptions([]);
//         return;
//       }

//       try {
//         const token = localStorage.getItem("accessToken");
//         const organization_id = sessionStorage.getItem("organization_id");
//         const branch_id = sessionStorage.getItem("branch_id");

//         if (!token) {
//           console.error("Access token not found in localStorage.");
//           return;
//         }

//         if (!organization_id || !branch_id) {
//           console.error("Missing organization_id or branch_id");
//           return;
//         }

//         const apiUrl = `${ApiUrl.apiurl}AccountDetails/GetAccountDetailsBasedOnBankId/?organization_id=${organization_id}&branch_id=${branch_id}&bank_id=${selectedBankId}`;

//         const response = await fetch(apiUrl, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log("Account Details API Response:", result);

//         if (result.message === "success!!" && Array.isArray(result.data)) {
//           const options = result.data.map((account) => ({
//             value: account.id,
//             label: account.bank_account, // visible text in dropdown
//             // optional if you want full details later
//           }));
//           setAccountNumberOptions(options);
//         } else {
//           setAccountNumberOptions([]);
//           console.warn("Unexpected API response:", result);
//         }
//       } catch (error) {
//         console.error("Error fetching account details:", error);
//       }
//     };

//     fetchAccountDetails();
//   }, [selectedBankId]);




//   const fetchStudentData = async ({ id, barcode, admissionNo } = {}) => {
//     // Validate that at least one identifier is provided
//     if (!id && !barcode && !admissionNo) {
//       console.error("No valid identifier provided to fetch data.");
//       return;
//     }

//     // Build query params
//     const queryParams = new URLSearchParams();
//     queryParams.append("flag", "y"); // MUST be lowercase
//     queryParams.append("student_course_id", id || "");
//     queryParams.append("barcode", barcode || "");
//     queryParams.append("college_admission_no", admissionNo || "");

//     const url = `http://31.97.63.174:9000/api/Filter/GetFilterStudentFilterdataBasedOnCondition/?${queryParams.toString()}`;

//     try {
//       const response = await fetch(url, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = await response.json();

//       if (data.message === "success!!") {
//         const studentData = data.data;
//         const feeDetails = studentData.feedetails || [];

//         // Aggregating period-wise totals
//         const periodMap = {};

//         feeDetails.forEach((item) => {
//           const period = item.semester; // Correct field

//           if (!periodMap[period]) {
//             periodMap[period] = {
//               period: period, // <-- store as `period`, not semester
//               totalAmount: 0,
//               paidAmount: 0,
//               discount: 0,
//               balanceAmount: 0,
//             };
//           }

//           periodMap[period].totalAmount +=
//             item.total_element_period_amount || item.element_amount;
//           periodMap[period].paidAmount += item.paid_amount;
//         });

//         // calculating balance
//         Object.keys(periodMap).forEach((key) => {
//           periodMap[key].balanceAmount =
//             periodMap[key].totalAmount - periodMap[key].paidAmount;
//         });

//         const uniquePeriods = Object.values(periodMap);

//         // Preparing aggregatedFeeDetails for nested table
//         const aggregatedFeeDetails = feeDetails.map((item) => ({
//           period: item.semester, // <-- IMPORTANT: match with uniquePeriods
//           element_name: item.element_name,
//           element_amount: item.element_amount,
//           paid_amount: item.paid_amount,
//           balance: item.element_amount - item.paid_amount,
//         }));

//         //  Assign to state
//         setUniquePeriods(uniquePeriods);
//         setAggregatedFeeDetails(aggregatedFeeDetails);

//         // other fields
//         setSelectedStudentId(studentData.studentId);
//         setClassName(studentData.course_name);
//         setSection(studentData.section_name);
//         setRollNo(studentData.enrollment_no);
//         setFeeGroup(studentData.feegroup);
//         setFeeDetails(feeDetails);
//       } else {
//         console.error("Failed to retrieve student data:", data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching student data:", error);
//     }
//   };

//   // Trigger the API call if any identifier is available in selectedStudent
//   useEffect(() => {
//     if (
//       selectedStudent.id ||
//       selectedStudent.barcode ||
//       selectedStudent.admissionNo
//     ) {
//       fetchStudentData({
//         id: selectedStudent.id,
//         barcode: selectedStudent.barcode,
//         admissionNo: selectedStudent.admissionNo,
//       });
//     }
//   }, [selectedStudent]);
//   // const handleSave = async () => {
//   //   const apiUrl = `${ApiUrl.apiurl}FeeReceipt/FeeReceiptCreate/`;

//   //   const organization_id = Number(sessionStorage.getItem("organization_id"));
//   //   const branch_id = Number(sessionStorage.getItem("branch_id"));
//   //   const batch_id = Number(selectedSession?.value);
//   //   const course_id = Number(selectedCourse?.value);
//   //   const department_id = Number(selectedDepartment?.value);
//   //   const academic_year_id = Number(selectedAcademicYear?.value);

//   //   // 🔥 FIXED SEMESTER IDS (correct handling)
//   //   let semester_ids = [];
//   //   if (selectedSemester) {
//   //     if (typeof selectedSemester === "object" && selectedSemester.value) {
//   //       semester_ids = [Number(selectedSemester.value)];
//   //     } else {
//   //       semester_ids = [Number(selectedSemester)];
//   //     }
//   //   }

//   //   const login_id = Number(sessionStorage.getItem("userId"));
//   //   const student_id = Number(selectedStudentId);

//   //   const receipt_date = dateRef.current.value;
//   //   const reference_date = selectedDate.toISOString().slice(0, 10);

//   //   let bank_id = null;
//   //   let account_number = null;

//   //   if (selectedPaymentMethodId === 1) {
//   //     bank_id = Number(selectedBankId);
//   //     const accObj = accountNumberOptions.find(
//   //       (x) => x.value === selectedAccountId
//   //     );
//   //     account_number = accObj?.label || null;
//   //   }

//   //   const student_fee_details_ids = selectedFeeDetails.map(
//   //     (x) => x.id ?? x.fee_detail_id
//   //   );

//   //   const exact = (key) => {
//   //     if (!charges[key]) return 0;
//   //     return Number(charges[key]);
//   //   };

//   //   const payload = {
//   //     organization_id,
//   //     branch_id,
//   //     batch_id,
//   //     course_id,
//   //     department_id,
//   //     academic_year_id,
//   //     semester_ids, // 🔥 FIXED
//   //     login_id,
//   //     student_id,
//   //     receipt_date,
//   //     payment_method_id: selectedPaymentMethodId,
//   //     bank_id,
//   //     account_number,
//   //     remarks: remark || "",
//   //     reference_date,
//   //     student_fee_details_ids,
//   //     late_fee: exact("late_fee"),
//   //     readmission_fees: exact("readmission_fees"),
//   //     discount_fee: exact("discount_fee"),
//   //     check_bounce_fee: exact("check_bounce_fee"),
//   //     total_amount: Number(paidAmount) || 0,
//   //   };

//   //   console.log("Payload sent →", payload);

//   //   const confirmed = window.confirm(
//   //     "Are you sure you want to create Fee Receipt?"
//   //   );
//   //   if (!confirmed) return;

//   //   try {
//   //     const response = await fetch(apiUrl, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(payload),
//   //     });

//   //     const result = await response.json();

//   //     if (response.ok && result.message?.includes("Success")) {
//   //       alert("Fee receipt created successfully!");
//   //       await generatePDF(result.receipt_data);
//   //       handleClear();
//   //     } else {
//   //       alert(result?.message || JSON.stringify(result));
//   //     }
//   //   } catch (err) {
//   //     alert("Something went wrong while saving receipt.");
//   //   }
//   // };

//   // ---------------- PDF GENERATION FUNCTION ----------------

//   const handleSave = async () => {
//     const apiUrl = `${ApiUrl.apiurl}FeeReceipt/FeeReceiptCreate/`;

//     const organization_id = Number(sessionStorage.getItem("organization_id"));
//     const branch_id = Number(sessionStorage.getItem("branch_id"));
//     const batch_id = Number(selectedSession?.value);
//     const course_id = Number(selectedCourse?.value);
//     const department_id = Number(selectedDepartment?.value);
//     const academic_year_id = Number(selectedAcademicYear?.value);

//     // ✅ FIXED: Get semester_id from selectedFeeDetails NOT dropdown
//     const semester_ids = [
//       ...new Set(
//         selectedFeeDetails
//           .map((x) => Number(x.period_id))
//           .filter((id) => !isNaN(id))
//       ),
//     ];

//     const login_id = Number(sessionStorage.getItem("userId"));
//     const student_id = Number(selectedStudentId);

//     const receipt_date = dateRef.current.value;
//     const reference_date = selectedDate.toISOString().slice(0, 10);

//     let bank_id = null;
//     let account_number = null;

//     if (selectedPaymentMethodId === 1) {
//       bank_id = Number(selectedBankId);
//       const accObj = accountNumberOptions.find(
//         (x) => x.value === selectedAccountId
//       );
//       account_number = accObj?.label || null;
//     }

//     const student_fee_details_ids = selectedFeeDetails.map(
//       (x) => x.id ?? x.fee_detail_id
//     );

//     const exact = (key) => (charges[key] ? Number(charges[key]) : 0);

//     const payload = {
//       organization_id,
//       branch_id,
//       batch_id,
//       course_id,
//       department_id,
//       academic_year_id,
//       semester_ids, // ✅ FIXED IDs FROM SELECTED FEE DETAILS
//       login_id,
//       student_id,
//       receipt_date,
//       payment_method_id: selectedPaymentMethodId,
//       bank_id,
//       account_number,
//       remarks: remark || "",
//       reference_date,
//       student_fee_details_ids,

//       late_fee: exact("late_fee"),
//       readmission_fees: exact("readmission_fees"),
//       discount_fee: exact("discount_fee"),
//       check_bounce_fee: exact("check_bounce_fee"),

//       total_amount: Number(paidAmount) || 0,
//     };

//     console.log("Payload sent →", payload);

//     const confirmed = window.confirm(
//       "Are you sure you want to create Fee Receipt?"
//     );
//     if (!confirmed) return;

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (response.ok && result.message?.includes("Success")) {
//         alert("Fee receipt created successfully!");
//         await generatePDF(result.receipt_data);
//         handleClear();
//       } else {
//         alert(result?.message || JSON.stringify(result));
//       }
//     } catch (err) {
//       alert("Something went wrong while saving receipt.");
//     }
//   };

//   const generatePDF = async (data) => {
//     const doc = new jsPDF("portrait", "mm", "a4");
//     const safe = (v) => (v === null || v === undefined ? "" : v);
//     const pageWidth = doc.internal.pageSize.getWidth();

//     // HEADER
//     doc.setFont("Helvetica", "bold");
//     doc.setFontSize(16);
//     doc.text("FEE RECEIPT", pageWidth / 2, 15, { align: "center" });

//     // MAIN DETAILS TABLE
//     const receiptDetails = [
//       [
//         "Receipt No",
//         safe(data.receipt_no),
//         "Receipt Date",
//         safe(data.receipt_date),
//       ],
//       [
//         "Student Name",
//         safe(data.student_name),
//         "Admission No",
//         safe(data.admission_no),
//       ],
//       ["Course", safe(data.course_name), "Section", safe(data.section_name)],
//       [
//         "Academic Year",
//         safe(data.academic_year),
//         "Father's Name",
//         safe(data.father_name),
//       ],
//     ];

//     doc.autoTable({
//       startY: 25,
//       body: receiptDetails,
//       theme: "grid",
//       styles: { fontSize: 10 },
//       tableWidth: 190,
//       margin: { left: 10 },
//     });

//     // FEE ELEMENT BREAKUP
//     const elements = [];
//     const paymentObj = data.payment_element_list || {};

//     Object.keys(paymentObj).forEach((key, index) => {
//       const row = paymentObj[key];
//       elements.push([
//         index + 1,
//         safe(row.element_name),
//         Number(row.amount || 0).toFixed(2),
//       ]);
//     });

//     elements.push(["", "Total Paid", Number(data.amount || 0).toFixed(2)]);

//     doc.autoTable({
//       startY: doc.lastAutoTable.finalY + 8,
//       head: [["Sr", "Fee Element", "Amount"]],
//       body: elements,
//       theme: "grid",
//       styles: { fontSize: 10 },
//       columnStyles: { 2: { halign: "right" } },
//       margin: { left: 10 },
//       tableWidth: 190,
//     });

//     // ------------------------------------------
//     // ✅ ADD OTHER CHARGES TABLE (NEW)
//     // ------------------------------------------

//     // doc.autoTable({
//     //   startY: doc.lastAutoTable.finalY + 8,
//     //   head: [["Other Charges", "Amount"]],
//     //   // body: otherCharges,
//     //   theme: "grid",
//     //   styles: { fontSize: 10 },
//     //   columnStyles: { 1: { halign: "right" } },
//     //   margin: { left: 10 },
//     //   tableWidth: 190,
//     // });

//     // PAYMENT DETAILS
//     doc.autoTable({
//       startY: doc.lastAutoTable.finalY + 8,
//       head: [["Payment Method", "Reference", "Amount"]],
//       body: [
//         [
//           safe(data.payment_method),
//           safe(data.payment_reference || "-"),
//           Number(data.amount || 0).toFixed(2),
//         ],
//       ],
//       theme: "grid",
//       styles: { fontSize: 10 },
//       columnStyles: { 2: { halign: "right" } },
//       margin: { left: 10 },
//       tableWidth: 190,
//     });

//     // SUMMARY TABLE
//     const summary = [
//       [
//         "Total Academic Year Fee",
//         Number(data.total_academic_year_fees || 0).toFixed(2),
//       ],
//       ["Total Paid", Number(data.total_paid || 0).toFixed(2)],
//       ["Balance Remaining", Number(data.remaining_amount || 0).toFixed(2)],
//     ];

//     doc.autoTable({
//       startY: doc.lastAutoTable.finalY + 10,
//       body: summary,
//       theme: "grid",
//       styles: { fontSize: 10, fontStyle: "bold" },
//       columnStyles: { 1: { halign: "right" } },
//       margin: { left: 10 },
//       tableWidth: 190,
//     });

//     // FOOTER
//     doc.setFontSize(9);
//     doc.text(
//       "This is a system-generated fee receipt. No signature is required.",
//       10,
//       doc.lastAutoTable.finalY + 10
//     );

//     // AUTO DOWNLOAD
//     const pdfBlob = doc.output("blob");
//     const pdfUrl = URL.createObjectURL(pdfBlob);
//     window.open(pdfUrl, "_blank");
//   };

//   const handleMainCheckboxChange = (row, index) => {
//     const isSelected = selectedPeriods.includes(index);

//     if (isSelected) {
//       // REMOVE period and all fee heads of that period
//       setSelectedPeriods(selectedPeriods.filter((i) => i !== index));

//       setSelectedFeeDetails((prev) =>
//         prev.filter((detail) => detail.period !== row.period)
//       );
//     } else {
//       // Get all fee heads under this period
//       const detailsForPeriod = aggregatedFeeDetails
//         .filter((d) => d.period === row.period && parseFloat(d.balance) > 0)
//         .map((d) => ({
//           id: d.id,
//           period: d.period,
//           element_name: d.element_name,
//           period_id: d.period_id,
//           paid: d.paid_amount,
//           balance: parseFloat(d.balance),
//           due: d.element_amount,
//         }));

//       setSelectedPeriods([...selectedPeriods, index]);

//       // ADD WITHOUT DUPLICATES
//       setSelectedFeeDetails((prev) => {
//         const merged = [...prev];

//         detailsForPeriod.forEach((item) => {
//           const exists = merged.some(
//             (d) =>
//               d.period === item.period && d.element_name === item.element_name
//           );
//           if (!exists) merged.push(item);
//         });

//         return merged;
//       });
//     }
//   };

//   const handleNestedCheckboxChange = (item, row) => {
//     setSelectedFeeDetails((prev) => {
//       const exists = prev.some(
//         (d) => d.period === row.period && d.element_name === item.element_name
//       );

//       if (exists) {
//         // REMOVE ITEM
//         return prev.filter(
//           (d) =>
//             !(d.period === row.period && d.element_name === item.element_name)
//         );
//       }

//       // ADD ITEM (NO DUPLICATES)
//       return [
//         ...prev,
//         {
//           id: item.id,
//           period: row.period,
//           element_name: item.element_name,
//           period_id: item.period_id,
//           paid: parseFloat(item.paid_amount),
//           balance: parseFloat(item.balance),
//           due: parseFloat(item.element_amount),
//         },
//       ];
//     });
//   };

//   // Helper function to group and sum fee details by element_name and period_month
//  const aggregateFeeDetails = (feeDetails) => {
//    const map = {};

//    feeDetails.forEach((item) => {
//      const key = `${item.semester}-${item.element_name}`;

//      if (!map[key]) {
//        map[key] = {
//          id: item.id,
//          period: item.semester,
//          period_id: item.semester_id,
//          element_name: item.element_name,
//          element_amount: Number(item.element_amount) || 0,
//          paid_amount: Number(item.paid_amount) || 0,
//        };
//      } else {
//        map[key].element_amount += Number(item.element_amount) || 0;
//        map[key].paid_amount += Number(item.paid_amount) || 0;
//      }

//      map[key].balance = map[key].element_amount - map[key].paid_amount;
//    });

//    return Object.values(map);
//  };

// useEffect(() => {
//   if (feeDetails.length > 0) {
//     setAggregatedFeeDetails(aggregateFeeDetails(feeDetails));
//     setUniquePeriods(getUniquePeriods(feeDetails));
//   }
// }, [feeDetails]);


//   useEffect(() => {
//     fetchStudentData();
//   }, []);

//   // Helper to get unique periods with summed total and balance amounts
//  const getUniquePeriods = (feeDetails) => {
//    if (!Array.isArray(feeDetails) || feeDetails.length === 0) return [];

//    const periodMap = new Map();

//    feeDetails.forEach((detail) => {
//      const period = detail.semester;
//      const elementAmount = Number(detail.element_amount) || 0;
//      const paidAmount = Number(detail.paid_amount) || 0;

//      if (!periodMap.has(period)) {
//        periodMap.set(period, {
//          period,
//          totalAmount: elementAmount,
//          paidAmount: paidAmount,
//          discount: 0,
//        });
//      } else {
//        const existing = periodMap.get(period);
//        existing.totalAmount += elementAmount;
//        existing.paidAmount += paidAmount;
//      }
//    });

//    return Array.from(periodMap.values()).map((p) => ({
//      ...p,
//      totalAmount: Number(p.totalAmount),
//      paidAmount: Number(p.paidAmount),
//      balanceAmount: Number(p.totalAmount - p.paidAmount),
//    }));
//  };


//   // const uniquePeriods = getUniquePeriods(feeDetails);

//   useEffect(() => {
//     // Get unique periods from feeDetails
//     const uniquePeriodsData = getUniquePeriods(feeDetails);
//     setUniquePeriods(uniquePeriodsData);
//   }, [feeDetails]);

//   const navigate = useNavigate();

//   const dateRef = useRef(null);
//   const handleOpenModal = () => setShowModal(true);
//   const handleCloseModal = () => setShowModal(false);

//   const handleSelectStudent = async (selectedStudent) => {
//     try {
//       // Safely extract student_id
//       const studentId =
//         selectedStudent?.fullData?.student ||
//         selectedStudent?.studentBasicDetails?.student_id ||
//         selectedStudent?.student_id ||
//         null;

//       if (!studentId) {
//         console.error("No valid student ID found in selected student");
//         return;
//       }

//       //  Store student_id for persistence
//       localStorage.setItem(
//         "selectedClubStudentId",
//         JSON.stringify({ student_id: studentId })
//       );

//       console.log(" Stored student_id in localStorage:", studentId);

//       //  Fetch full details from the API
//       await fetchStudentDetails(studentId);

//       //  Close modal
//       handleCloseModal();
//     } catch (error) {
//       console.error(" Error handling selected student:", error);
//     }
//   };

//   const fetchStudentDetails = async (student_id) => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const organization_id = sessionStorage.getItem("organization_id");
//       const branch_id = sessionStorage.getItem("branch_id");

//       if (!student_id || !organization_id || !branch_id || !token) {
//         console.error(" Missing identifiers for fetching student data");
//         return;
//       }

//       const url = `${ApiUrl.apiurl}StudentCourse/GetStudentDataBasedId/?student_id=${student_id}&branch_id=${branch_id}&organization_id=${organization_id}`;
//       console.log(" Fetching from:", url);

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) throw new Error("Failed to fetch student details");

//       const result = await response.json();
//       console.log("🔹 API Response:", result);

//       if (result.message === "Success" && result.data) {
//         const student = result.data;

//         setStudentDetails(student);
//         setStudentName(student.student_name || "");

//         setSelectedStudent({
//           name: student.student_name || "",
//           barcode: student.barcode || "",
//           admissionNo: student.college_admission_no || "",
//         });

//         setSelectedSession({
//           value: student.batch_id,
//           label: student.batch,
//         });

//         setSelectedCourse({
//           value: student.course_id,
//           label: student.course_name,
//         });

//         setSelectedDepartment({
//           value: student.department_id,
//           label: student.department,
//         });

//         setSelectedAcademicYear({
//           value: student.academic_year_id,
//           label: student.academic_year,
//         });

//         setSelectedSemester({
//           value: student.semester_id,
//           label: student.semester_name,
//         });

//         setSelectedSection({
//           value: student.section_id,
//           label: student.section_name,
//         });
//       } else {
//         console.warn(" No data found for student_id:", student_id);
//       }
//     } catch (error) {
//       console.error("Error fetching student details:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     console.log(name, value, "hii");
//     setCharges((prevCharges) => ({
//       ...prevCharges,
//       [name]: value,
//     }));
//   };

//   useEffect(() => {
//     if (!isUserInput) {
//       setPaidAmount(totalDues + totalOtherCharges);
//     }
//   }, [totalDues, totalOtherCharges, isUserInput]);

//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD
//     dateRef.current.value = today; // Set the default value
//   }, []);

//   const handleCloseButton = () => {
//     navigate("/admin/fee-search");
//   };

//   useEffect(() => {
//     if (studentBarcode || schoolAdmissionNo || studentName) {
//       fetchStudentData();
//     }
//   }, [studentBarcode, schoolAdmissionNo, studentName]);

//   useEffect(() => {
//     if (
//       selectedStudent.studentId ||
//       selectedStudent.barcode ||
//       selectedStudent.admissionNo
//     ) {
//       // Clear previous selections before loading new student data
//       setSelectedPeriods([]);
//       setSelectedFeeDetails([]);

//       fetchStudentData({
//         studentId: selectedStudent.studentId,
//         barcode: selectedStudent.barcode,
//         admissionNo: selectedStudent.admissionNo,
//       });
//     }
//   }, [selectedStudent]);

//   useEffect(() => {
//     if (selectedFeeDetails.length > 0) {
//       // Sum up all the balance amounts from the selectedFeeDetails array
//       const totalBalanceAmount = selectedFeeDetails.reduce(
//         (total, feeDetail) => total + (feeDetail.balance || 0),
//         0
//       );

//       // Set the summed balance as the value for Amount and Paid Amount fields
//       setSelectedAmount(totalBalanceAmount);
//       setPaidAmount(totalBalanceAmount);
//     }
//   }, [selectedFeeDetails]);

//   // Handler for updating the amount field
//   const handleAmountChange = (event) => {
//     const value = parseFloat(event.target.value) || 0; // Ensure the value is a number (default to 0 if invalid)
//     setSelectedAmount(value);
//     setPaidAmount(value); // Update Paid Amount when Amount changes
//   };

//   // Calculate balance when gross amount or paid amount changes
//   useEffect(() => {
//     const grossAmount = totalDues + totalOtherCharges;
//     setBalance(grossAmount - paidAmount);
//   }, [totalDues, totalOtherCharges, paidAmount]);

//   // Sync SelectedAmount whenever PaidAmount changes
//   useEffect(() => {
//     setSelectedAmount(paidAmount);
//   }, [paidAmount]);

//   const handlePaidAmountChange = (e) => {
//     const newPaidAmount = parseFloat(e.target.value) || 0;
//     setPaidAmount(newPaidAmount);
//   };
//   return (
//     <div className="container-fluid ">
//       <div className="row">
//         <div className="col-12">
//           <div className="card p-0">
//             <div className="card-body">
//               <p
//                 style={{
//                   marginBottom: "0px",
//                   textAlign: "center",
//                   fontSize: "20px",
//                   fontWeight: "700",
//                 }}
//               >
//                 FEE COLLECTION
//               </p>
//               <div className="row mb-3 mt-3 mx-0">
//                 <div className="col-12 d-flex flex-wrap gap-2">
//                   <button
//                     type="button"
//                     className="btn btn-primary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleSave}
//                   >
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleClear}
//                   >
//                     Clear
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-danger me-2"
//                     style={{
//                       width: "150px",
//                     }}
//                     onClick={handleCloseButton}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>

//               <div className="row mt-3 mx-2 mb-4 ">
//                 <div className="col-12 custom-section-box">
//                   <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
//                     <div className="row flex-grow-1">
//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="date" className="form-label">
//                           Date
//                         </label>
//                         <input
//                           type="date"
//                           id="date"
//                           className="form-control detail"
//                           ref={dateRef}
//                         />
//                       </div>

//                       <div className="col-12 col-md-3 mb-3">
//                         <label htmlFor="student-barcode" className="form-label">
//                           Student BarCode
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="student-barcode"
//                             className="form-control detail"
//                             placeholder="Enter student barcode"
//                             value={selectedStudent.barcode || ""}
//                             onChange={(e) =>
//                               setSelectedStudent((prev) => ({
//                                 ...prev,
//                                 barcode: e.target.value,
//                               }))
//                             }
//                             onBlur={fetchStudentData}
//                           />
//                         </div>
//                       </div>

//                       <div className="col-12 col-md-3 mb-1">
//                         <label
//                           htmlFor="school-admission-no"
//                           className="form-label "
//                         >
//                           School Admission No
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="school-admission-no"
//                             className="form-control detail"
//                             placeholder="Enter school admission no"
//                             value={selectedStudent.admissionNo || ""}
//                             onChange={(e) =>
//                               setSelectedStudent((prev) => ({
//                                 ...prev,
//                                 admissionNo: e.target.value,
//                               }))
//                             }
//                             onBlur={fetchStudentData}
//                           />
//                         </div>
//                       </div>

//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="student-name" className="form-label">
//                           Student Name
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="student-name"
//                             className="form-control detail"
//                             placeholder="Enter student name"
//                             value={selectedStudent.name || ""}
//                             onChange={(e) =>
//                               setSelectedStudent((prev) => ({
//                                 ...prev,
//                                 name: e.target.value,
//                               }))
//                             }
//                             onBlur={fetchStudentData}
//                           />
//                           <button
//                             type="button"
//                             className="btn btn-primary ms-2 mb-0 mt-0"
//                             onClick={handleOpenModal}
//                             style={{ width: "50px", padding: "3px" }}
//                           >
//                             ...
//                           </button>
//                         </div>
//                       </div>
//                       <SelectStudentFeeModal
//                         show={showModal}
//                         handleClose={handleCloseModal}
//                         onSelectStudent={handleSelectStudent}
//                       />
//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="class" className="form-label">
//                           Session
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="session"
//                             className="form-control detail"
//                             placeholder="Enter Session"
//                             value={selectedSession?.label || ""}
//                             readOnly
//                           />
//                         </div>
//                       </div>
//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="class" className="form-label">
//                           Course
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="course"
//                             className="form-control detail"
//                             placeholder="Enter Course"
//                             value={selectedCourse?.label || ""}
//                             readOnly
//                           />
//                         </div>
//                       </div>

//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="roll-no" className="form-label">
//                           Department
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="branch"
//                             className="form-control detail"
//                             placeholder="Enter Branch"
//                             value={selectedDepartment?.label || ""}
//                             readOnly
//                           />
//                         </div>
//                       </div>

//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="roll-no" className="form-label">
//                           Academic Year
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="academic-year"
//                             className="form-control detail"
//                             placeholder="Enter Academic Year"
//                             value={selectedAcademicYear?.label || ""}
//                             readOnly
//                           />
//                         </div>
//                       </div>
//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="roll-no" className="form-label">
//                           Semester
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="semester"
//                             className="form-control detail"
//                             placeholder="Enter Semester"
//                             value={selectedSemester?.label || ""}
//                             readOnly
//                           />
//                         </div>
//                       </div>

//                       <div className="col-12 col-md-3 mb-1">
//                         <label htmlFor="section" className="form-label">
//                           Section
//                         </label>
//                         <div className="d-flex align-items-center">
//                           <input
//                             type="text"
//                             id="period"
//                             className="form-control detail"
//                             placeholder="Enter section"
//                             value={selectedSection?.label || ""}
//                             readOnly
//                           />
//                         </div>
//                       </div>

//                       <div className="col-12 col-md-3 mb-4">
//                         <label htmlFor="fee-group" className="form-label">
//                           Fee Group
//                         </label>
//                         <Select
//                           id="fee-group"
//                           className="detail"
//                           value={{ label: feeGroup, value: feeGroup }}
//                           options={[]}
//                           placeholder="Select Fee Group"
//                           // classNamePrefix="react-select"
//                           isDisabled={false} // Set to false to allow selection if needed
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="row mx-2">
//                 <div className="col-md-6" style={{ border: "1px solid #ccc" }}>
//                   <h4>Fee Period Details</h4>
//                   <div className="table-responsive">
//                     <table className="table table-bordered">
//                       <thead className="table-header">
//                         <tr>
//                           <th></th>
//                           <th>Semester</th>
//                           <th>Total Amount</th>
//                           <th>Paid Amount</th>
//                           <th>Discount</th>
//                           <th>Balance Amount</th>
//                           <th>Pay</th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {uniquePeriods.map((row, index) => (
//                           <React.Fragment key={index}>
//                             <tr
//                               className="highlight"
//                               onClick={() => handleRowClick(index)}
//                             >
//                               <td>
//                                 <FaPlus style={{ cursor: "pointer" }} />
//                               </td>
//                               <td>{row.period}</td>
//                               <td>{row.totalAmount}</td>
//                               <td>{row.paidAmount}</td>
//                               <td>{row.discount}</td>
//                               <td>{row.balanceAmount}</td>
//                               <td>
//                                 {row.balanceAmount > 0 ? (
//                                   <input
//                                     type="checkbox"
//                                     checked={selectedPeriods.includes(index)}
//                                     onChange={() =>
//                                       handleMainCheckboxChange(row, index)
//                                     }
//                                   />
//                                 ) : null}
//                               </td>
//                             </tr>
//                             {expandedRow === index && (
//                               <tr>
//                                 <td colSpan="7">
//                                   <div className="table-responsive">
//                                     <table className="table table-bordered">
//                                       <thead>
//                                         <tr>
//                                           <th>Element Name</th>
//                                           <th>Amount</th>
//                                           <th>Paid</th>
//                                           <th>Balance</th>
//                                           <th>Pay</th>
//                                         </tr>
//                                       </thead>
//                                       <tbody>
//                                         {aggregatedFeeDetails
//                                           .filter(
//                                             (detail) =>
//                                               detail.period === row.period
//                                           )
//                                           .map((item, subIndex) => (
//                                             <tr key={subIndex}>
//                                               <td>{item.element_name}</td>
//                                               <td>
//                                                 {item.element_amount.toFixed(2)}
//                                               </td>
//                                               <td>
//                                                 {item.paid_amount.toFixed(2)}
//                                               </td>
//                                               <td>{item.balance}</td>
//                                               <td>
//                                                 {parseFloat(item.balance) >
//                                                 0 ? (
//                                                   <input
//                                                     type="checkbox"
//                                                     checked={selectedFeeDetails.some(
//                                                       (detail) =>
//                                                         detail.period ===
//                                                           row.period &&
//                                                         detail.element_name ===
//                                                           item.element_name
//                                                     )}
//                                                     onChange={() =>
//                                                       handleNestedCheckboxChange(
//                                                         item,
//                                                         row
//                                                       )
//                                                     }
//                                                   />
//                                                 ) : null}
//                                               </td>
//                                             </tr>
//                                           ))}
//                                       </tbody>
//                                     </table>
//                                   </div>
//                                 </td>
//                               </tr>
//                             )}
//                           </React.Fragment>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 <div className="col-md-6" style={{ border: "1px solid #ccc" }}>
//                   <h4>Fee Paid Details</h4>
//                   <div className="table-responsive">
//                     <table className="table table-bordered ">
//                       <thead className="table-header">
//                         <tr>
//                           <th>Fee Period</th>
//                           <th>Fee Heads</th>
//                           <th>Due</th>
//                           <th>Paid</th>
//                           <th>Balance</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedFeeDetails.map((detail, idx) => (
//                           <tr key={idx}>
//                             <td>{detail.period}</td>
//                             <td>{detail.element_name}</td>
//                             <td>
//                               {detail.due ? detail.due.toFixed(2) : "0.00"}
//                             </td>
//                             <td>
//                               {detail.paid ? detail.paid.toFixed(2) : "0.00"}
//                             </td>
//                             <td>
//                               {detail.balance
//                                 ? detail.balance.toFixed(2)
//                                 : "0.00"}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>

//               <div className="row mx-2">
//                 <div className="col-md-6" style={{ border: "1px solid #ccc" }}>
//                   <h4>Fee Details</h4>
//                   <div className="table-responsive">
//                     <table className="table table-bordered ">
//                       <thead className="table-header">
//                         <tr>
//                           <th>Period</th>
//                           <th>Fee Heads</th>
//                           <th>Due</th>
//                           <th>Paid</th>
//                           <th>Balance</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {uniquePeriods
//                           .filter((row) => {
//                             const total = Number(row.totalAmount);
//                             const paid = Number(row.paidAmount);

//                             return paid >= total / 2; // FULL or HALF paid
//                           })
//                           .map((row, index) => (
//                             <React.Fragment key={index}>
//                               {aggregatedFeeDetails
//                                 .filter(
//                                   (detail) => detail.period === row.period
//                                 )
//                                 .map((item, subIndex) => (
//                                   <tr key={subIndex}>
//                                     <td>{row.period}</td>
//                                     <td>{item.element_name}</td>
//                                     <td>{item.element_amount.toFixed(2)}</td>
//                                     <td>{item.paid_amount.toFixed(2)}</td>
//                                     <td>{item.balance.toFixed(2)}</td>
//                                   </tr>
//                                 ))}
//                             </React.Fragment>
//                           ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 <div className="col-md-6" style={{ border: "1px solid #ccc" }}>
//                   <h4>Payment Details</h4>
//                   <form className="row g-3">
//                     {/* Payment Method */}
//                     <div className="col-md-3">
//                       <label htmlFor="paymentMethod" className="form-label">
//                         Payment Method
//                       </label>

//                       <Select
//                         id="paymentMethod"
//                         className="detail"
//                         options={paymentMethodOptions}
//                         classNamePrefix="react-select"
//                         isClearable={false}
//                         placeholder="Select Method"
//                         value={
//                           paymentMethodOptions.find(
//                             (option) => option.value === selectedPaymentMethodId
//                           ) || null
//                         }
//                         onChange={(selectedOption) => {
//                           const newValue = selectedOption
//                             ? selectedOption.value
//                             : null;
//                           setSelectedPaymentMethodId(newValue);

//                           // Clear when Cash selected
//                           if (newValue === 2) {
//                             setSelectedBankId(null);
//                             setSelectedAccountId(null);
//                           }
//                         }}
//                       />
//                     </div>

//                     {/* Bank Name */}
//                     <div className="col-md-3">
//                       <label htmlFor="bankName" className="form-label">
//                         Bank Name
//                       </label>
//                       <Select
//                         classNamePrefix="react-select"
//                         className="detail"
//                         options={bankOptions}
//                         placeholder="Select Bank"
//                         value={
//                           selectedBankId
//                             ? bankOptions.find(
//                                 (option) => option.value === selectedBankId
//                               )
//                             : null
//                         }
//                         onChange={(selectedOption) =>
//                           setSelectedBankId(
//                             selectedOption ? selectedOption.value : null
//                           )
//                         }
//                         isDisabled={selectedPaymentMethodId === 2}
//                       />
//                     </div>

//                     {/* Account Name */}
//                     <div className="col-md-3 ">
//                       <label htmlFor="accountName" className="form-label">
//                         Account Number
//                       </label>
//                       <Select
//                         id="accountName"
//                         className="detail"
//                         options={accountNumberOptions}
//                         classNamePrefix="react-select"
//                         placeholder="Select Account"
//                         isClearable={false}
//                         isDisabled={selectedPaymentMethodId === 2}
//                         value={
//                           selectedAccountId
//                             ? accountNumberOptions.find(
//                                 (option) => option.value === selectedAccountId
//                               )
//                             : null
//                         }
//                         onChange={(selectedOption) =>
//                           setSelectedAccountId(
//                             selectedOption ? selectedOption.value : null
//                           )
//                         }
//                       />
//                     </div>

//                     {/* Reference Date */}
//                     <div className="col-md-3">
//                       <label htmlFor="referenceDate" className="form-label">
//                         Reference Date
//                       </label>
//                       <DatePicker
//                         selected={selectedDate}
//                         onChange={(date) => setSelectedDate(date)}
//                         dateFormat="yyyy/MM/dd"
//                         className="form-control detail"
//                         id="referenceDate"
//                       />
//                     </div>

//                     {/* Amount */}
//                     <div className="col-md-3 mb-3">
//                       <label htmlFor="amount" className="form-label">
//                         Amount
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control detail"
//                         id="amount"
//                         // value={selectedAmount} // Automatically set the Amount to the selected "Due" value

//                         value={selectedAmount === 0 ? "" : selectedAmount} // Default to empty string if the amount is 0
//                         onChange={handleAmountChange} // Allow the user to change the value
//                       />
//                     </div>

//                     {/* Reference */}
//                     <div className="col-md-3">
//                       <label htmlFor="reference" className="form-label">
//                         Reference
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control detail"
//                         id="reference"
//                         value={remark}
//                         onChange={(e) => setRemark(e.target.value)}
//                       />
//                     </div>
//                   </form>
//                 </div>
//               </div>

//               <div class="row">
//                 <div class="col-md-6"></div>

//                 {/* <!-- Other Charges --> */}
//                 <div className="col-md-3" style={{ border: "1px solid #ccc" }}>
//                   <h4>Other Charges</h4>

//                   <div className="table-responsive">
//                     <table className="table table-bordered">
//                       <tbody>
//                         {[
//                           { label: "Late Fee", key: "late_fee" },
//                           { label: "ReAdmission", key: "readmission_fees" },
//                           { label: "Discount", key: "discount_fee" },
//                           { label: "Cheque Bounce", key: "check_bounce_fee" },
//                         ].map((item, index) => (
//                           <tr key={index}>
//                             <td className="align-middle">{item.label}</td>

//                             <td className="d-flex align-items-center">
//                               {/* Checkbox */}
//                               <input
//                                 type="checkbox"
//                                 className="me-2"
//                                 checked={charges[item.key] !== undefined}
//                                 onChange={(e) => {
//                                   if (e.target.checked) {
//                                     setCharges((prev) => ({
//                                       ...prev,
//                                       [item.key]: "", // Start as empty string (user controlled)
//                                     }));
//                                   } else {
//                                     const cp = { ...charges };
//                                     delete cp[item.key];
//                                     setCharges(cp);
//                                   }
//                                 }}
//                               />

//                               {/* Input */}
//                               <input
//                                 type="number"
//                                 className="form-control form-control-sm w-auto"
//                                 value={charges[item.key] ?? ""}
//                                 disabled={charges[item.key] === undefined}
//                                 onChange={(e) => {
//                                   const value = e.target.value;
//                                   setCharges((prev) => ({
//                                     ...prev,
//                                     [item.key]: value, // Store RAW value (do NOT convert)
//                                   }));
//                                 }}
//                               />
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   <h6 style={{ fontWeight: 700 }}>Send SMS</h6>
//                   <div
//                     className="form-check d-flex justify-content-center align-items-center"
//                     style={{ border: "1px solid #ccc", padding: "10px" }}
//                   >
//                     <input
//                       className="form-check-input me-2"
//                       type="checkbox"
//                       id="sendSMS"
//                     />
//                     <label className="form-check-label" htmlFor="sendSMS">
//                       Send SMS
//                     </label>
//                   </div>
//                 </div>

//                 {/* <!-- Totals --> */}
//                 <div class="col-md-3" style={{ border: "1px solid #ccc" }}>
//                   <h4>Totals</h4>
//                   <div className="table-responsive">
//                     <table className="table table-bordered ">
//                       <tbody>
//                         <tr>
//                           <td>Total Dues</td>
//                           <td>
//                             <input
//                               type="text"
//                               className="form-control detail"
//                               value={totalDues.toFixed(2)} // Total Dues
//                               readOnly
//                             />
//                           </td>
//                         </tr>
//                         <tr>
//                           <td>Service Charges</td>
//                           <td>
//                             <input
//                               type="text"
//                               className="form-control detail"
//                               value="0.00" // Placeholder for service charges, modify if needed
//                               readOnly
//                             />
//                           </td>
//                         </tr>
//                         <tr>
//                           <td>Total Other Charges</td>
//                           <td>
//                             <input
//                               type="text"
//                               className="form-control detail"
//                               value={totalOtherCharges.toFixed(2)}
//                               readOnly
//                             />
//                           </td>
//                         </tr>
//                         <tr>
//                           <td>Gross Amount</td>
//                           <td>
//                             <input
//                               type="text"
//                               className="form-control detail"
//                               value={(totalDues + totalOtherCharges).toFixed(2)} // Gross Amount (Total Dues + other charges)
//                               readOnly
//                             />
//                           </td>
//                         </tr>
//                         <tr>
//                           <td>Paid Amount</td>
//                           <td>
//                             <input
//                               type="text"
//                               className="form-control detail"
//                               value={paidAmount.toFixed(2)}
//                               onChange={handlePaidAmountChange} // Paid Amount
//                               // value={(totalDues + totalOtherCharges).toFixed(2)}
//                               readOnly
//                             />
//                           </td>
//                         </tr>
//                         <tr>
//                           <td>Balance</td>
//                           <td>
//                             <input
//                               type="text"
//                               className="form-control detail"
//                               value={balance.toFixed(2)} // Balance (Gross Amount - Paid Amount)
//                               readOnly
//                             />
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>

//               <div class="row">
//                 <div class="col-md-6"></div>
//                 <div class="col-md-6" style={{ border: "1px solid #ccc" }}>
//                   <div class="mb-3">
//                     <label for="exampleFormControlTextarea1" class="form-label">
//                       Remarks
//                     </label>
//                     <textarea
//                       class="form-control"
//                       id="exampleFormControlTextarea1"
//                       rows="3"
//                     ></textarea>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeeCollection;





import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectStudentModal from "../AdminAttendanceEntry/SelectStudentModal";
import SelectStudentFeeModal from "../FeeStudentModal/SelectStudentFeeModal";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { FaPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { ApiUrl } from "../../../ApiUrl";
import jsPDF from "jspdf";
import "jspdf-autotable";

const FeeCollection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [lateFeeAmount, setLateFeeAmount] = useState(0);
  const [chequeBounceAmount, setChequeBounceAmount] = useState(0);
  const [reAdmissionAmount, setReAdmissionAmount] = useState(0);
  const [amount, setAmount] = useState(0); // Track the payment amount
  const [balance, setBalance] = useState(0);
  const [bank, setBank] = useState(null);
  const [bankOptions, setBankOptions] = useState([]);

  const [selectedAmount, setSelectedAmount] = useState(0); // State to store the selected "Due" value

  const [lateFee, setLateFee] = useState(0);
  const [reAdmission, setReAdmission] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [chequeBounce, setChequeBounce] = useState(0);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [accountNumberOptions, setAccountNumberOptions] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [selectedFeeDetails, setSelectedFeeDetails] = useState([]);
  const [totalDues, setTotalDues] = useState(0);
  const [totalOtherCharges, setTotalOtherCharges] = useState(0);
  const [lateFeeEnabled, setLateFeeEnabled] = useState(false);
  const [reAdmissionEnabled, setReAdmissionEnabled] = useState(false);
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [uniquePeriods, setUniquePeriods] = useState([]);
  const [chequeBounceEnabled, setChequeBounceEnabled] = useState(false);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);

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
  const [studentBarcode, setStudentBarcode] = useState("");
  const [schoolAdmissionNo, setSchoolAdmissionNo] = useState("");
  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [feeGroup, setFeeGroup] = useState("");
  const [selectedSection, setSelectedSection] = useState();
  const [selectedSemester, setSelectedSemester] = useState();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedSession, setSelectedSession] = useState();
  const [studentDetails, setStudentDetails] = useState();
  // const [charges, setCharges] = useState({
  //   lateFee: 0,
  //   readmission: 0,
  //   discount: 0,
  //   chequeBounce: 0,
  // });

  const [charges, setCharges] = useState({});
  useEffect(() => {
    const computedTotalDues = selectedFeeDetails.reduce(
      (sum, detail) => sum + (detail.balance || 0),
      0
    );
    setTotalDues(computedTotalDues);
  }, [selectedFeeDetails]);

  useEffect(() => {
    const computedTotalOtherCharges = Object.entries(charges).reduce(
      (acc, [key, val]) => {
        const value = parseFloat(val || 0);

        //  ONLY discount should subtract
        if (key === "discount_fee") {
          return acc - value;
        }

        //All others add
        return acc + value;
      },
      0
    );

    setTotalOtherCharges(computedTotalOtherCharges);
  }, [charges]);

  const [paidAmount, setPaidAmount] = useState(totalDues + totalOtherCharges);
  const [isUserInput, setIsUserInput] = useState(false);
  const [remark, setRemark] = useState("");
  const [paymentRemark, setPaymentRemark] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [elementNameOptions, setElementNameOptions] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index); // Toggle row expansion
  };
  const [selectedStudent, setSelectedStudent] = useState({
    studentId: "",
    name: "",
    barcode: "",
    admissionNo: "",
    class: "",
    section: "",
  });

  const [feeDetails, setFeeDetails] = useState([]);

  const [aggregatedFeeDetails, setAggregatedFeeDetails] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const handleClear = () => {
    // RESET SELECTION STATES
    setSelectedFeeDetails([]);
    setSelectedPeriods([]);
    setSelectedPeriod(null);
    setExpandedRow(null);

    // RESET AMOUNT AND CHARGES
    setTotalDues(0);
    setTotalOtherCharges(0);
    setPaidAmount(0);
    setIsUserInput(false);
    setAmount(0);
    setBalance(0);

    setCharges({
      lateFee: 0,
      readmission: 0,
      discount: 0,
      chequeBounce: 0,
    });

    setLateFeeAmount(0);
    setChequeBounceAmount(0);
    setReAdmissionAmount(0);
    setLateFee(0);
    setChequeBounce(0);
    setReAdmission(0);
    setDiscount(0);

    // BANK & PAYMENT — do NOT clear options, only reset selected values
    setSelectedBankId(null);
    setSelectedAccountId(null);
    setSelectedPaymentMethodId(null);
    setBank(null);

    // Clear payment method specific fields
    setChequeNumber("");
    setChequeBankName("");
    setChequeBranchName("");
    setDdNumber("");
    setDdIssuingBank("");
    setUpiUtrNo("");
    setRtgsUtrNo("");
    setRtgsSenderBank("");
    setRtgsAccountNo("");

    // STUDENT DETAILS
    setSelectedStudent({
      studentId: "",
      name: "",
      barcode: "",
      admissionNo: "",
      class: "",
      section: "",
    });

    setStudentBarcode("");
    setSchoolAdmissionNo("");
    setStudentName("");
    setClassName("");
    setSection("");
    setRollNo("");
    setFeeGroup("");

    // DROPDOWN SELECTED VALUES (not the options!)
    setSelectedSection(null);
    setSelectedSemester(null);
    setSelectedAcademicYear(null);
    setSelectedDepartment(null);
    setSelectedCourse(null);
    setSelectedSession(null);

    // TABLE DATA (only selected items)
    setFeeDetails([]); // If needed
    setAggregatedFeeDetails([]);
    setUniquePeriods([]);

    // UI RESET
    setShowModal(false);
    setElementNameOptions([]);
    setRemark("");
    setPaymentRemark("");

    // Reset date if needed
    setSelectedDate(new Date());
  };

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(`${ApiUrl.apiurl}BANK/GetAllBankList/`);
        const result = await response.json();

        if (result.message === "Success") {
          // Map API response to the format React Select needs
          const options = result.data.map((bank) => ({
            value: bank.id, // Bank ID as the value
            label: bank.bankname, // Bank name as the label
          }));
          setBankOptions(options);
        } else {
          console.error("Failed to fetch banks:", result.message);
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!selectedBankId) return; // Do nothing if no bank is selected

      try {
        const response = await fetch(
          `${ApiUrl.apiurl}Account_Details/GetAccountDetailsBasedOnBankId/${selectedBankId}/`
        );
        const result = await response.json();

        if (result.message === "success!!") {
          // Map API response to the format React Select needs
          const options = result.data.map((account) => ({
            value: account.id, // Account ID as the value
            label: `${account.bank_account}`, // Account number as the label
          }));
          setAccountNumberOptions(options);
        } else {
          console.error("Failed to fetch account details:", result.message);
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    fetchAccountDetails();
  }, [selectedBankId]);

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
    const fetchAccountDetails = async () => {
      if (!selectedBankId) {
        setAccountNumberOptions([]);
        return;
      }

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

        const apiUrl = `${ApiUrl.apiurl}AccountDetails/GetAccountDetailsBasedOnBankId/?organization_id=${organization_id}&branch_id=${branch_id}&bank_id=${selectedBankId}`;

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
        console.log("Account Details API Response:", result);

        if (result.message === "success!!" && Array.isArray(result.data)) {
          const options = result.data.map((account) => ({
            value: account.id,
            label: account.bank_account, // visible text in dropdown
            // optional if you want full details later
          }));
          setAccountNumberOptions(options);
        } else {
          setAccountNumberOptions([]);
          console.warn("Unexpected API response:", result);
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    fetchAccountDetails();
  }, [selectedBankId]);

  const fetchStudentData = async ({ id, barcode, admissionNo } = {}) => {
    // Validate that at least one identifier is provided
    if (!id && !barcode && !admissionNo) {
      console.error("No valid identifier provided to fetch data.");
      return;
    }

    // Build query params
    const queryParams = new URLSearchParams();
    queryParams.append("flag", "y"); // MUST be lowercase
    queryParams.append("student_course_id", id || "");
    queryParams.append("barcode", barcode || "");
    queryParams.append("college_admission_no", admissionNo || "");

    const url = `${ApiUrl.apiurl}Filter/GetFilterStudentFilterdataBasedOnCondition/?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.message === "success!!") {
        const studentData = data.data;
        const feeDetails = studentData.feedetails || [];

        // Aggregating period-wise totals
        const periodMap = {};

        feeDetails.forEach((item) => {
          const period = item.semester; // Correct field

          if (!periodMap[period]) {
            periodMap[period] = {
              period: period, // <-- store as `period`, not semester
              totalAmount: 0,
              paidAmount: 0,
              discount: 0,
              balanceAmount: 0,
            };
          }

          periodMap[period].totalAmount +=
            item.total_element_period_amount || item.element_amount;
          periodMap[period].paidAmount += item.paid_amount;
        });

        // calculating balance
        Object.keys(periodMap).forEach((key) => {
          periodMap[key].balanceAmount =
            periodMap[key].totalAmount - periodMap[key].paidAmount;
        });

        const uniquePeriods = Object.values(periodMap);

        // Preparing aggregatedFeeDetails for nested table
        const aggregatedFeeDetails = feeDetails.map((item) => ({
          period: item.semester, // <-- IMPORTANT: match with uniquePeriods
          element_name: item.element_name,
          element_amount: item.element_amount,
          paid_amount: item.paid_amount,
          balance: item.element_amount - item.paid_amount,
        }));

        //  Assign to state
        setUniquePeriods(uniquePeriods);
        setAggregatedFeeDetails(aggregatedFeeDetails);

        // other fields
        setSelectedStudentId(studentData.studentId);
        setClassName(studentData.course_name);
        setSection(studentData.section_name);
        setRollNo(studentData.enrollment_no);
        setFeeGroup(studentData.feegroup);
        setFeeDetails(feeDetails);
      } else {
        console.error("Failed to retrieve student data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  // Trigger the API call if any identifier is available in selectedStudent

  // const handleSave = async () => {
  //   const apiUrl = `${ApiUrl.apiurl}FeeReceipt/FeeReceiptCreate/`;

  //   const organization_id = Number(sessionStorage.getItem("organization_id"));
  //   const branch_id = Number(sessionStorage.getItem("branch_id"));
  //   const batch_id = Number(selectedSession?.value);
  //   const course_id = Number(selectedCourse?.value);
  //   const department_id = Number(selectedDepartment?.value);
  //   const academic_year_id = Number(selectedAcademicYear?.value);

  //   // 🔥 FIXED SEMESTER IDS (correct handling)
  //   let semester_ids = [];
  //   if (selectedSemester) {
  //     if (typeof selectedSemester === "object" && selectedSemester.value) {
  //       semester_ids = [Number(selectedSemester.value)];
  //     } else {
  //       semester_ids = [Number(selectedSemester)];
  //     }
  //   }

  //   const login_id = Number(sessionStorage.getItem("userId"));
  //   const student_id = Number(selectedStudentId);

  //   const receipt_date = dateRef.current.value;
  //   const reference_date = selectedDate.toISOString().slice(0, 10);

  //   let bank_id = null;
  //   let account_number = null;

  //   if (selectedPaymentMethodId === 1) {
  //     bank_id = Number(selectedBankId);
  //     const accObj = accountNumberOptions.find(
  //       (x) => x.value === selectedAccountId
  //     );
  //     account_number = accObj?.label || null;
  //   }

  //   const student_fee_details_ids = selectedFeeDetails.map(
  //     (x) => x.id ?? x.fee_detail_id
  //   );

  //   const exact = (key) => {
  //     if (!charges[key]) return 0;
  //     return Number(charges[key]);
  //   };

  //   const payload = {
  //     organization_id,
  //     branch_id,
  //     batch_id,
  //     course_id,
  //     department_id,
  //     academic_year_id,
  //     semester_ids, // 🔥 FIXED
  //     login_id,
  //     student_id,
  //     receipt_date,
  //     payment_method_id: selectedPaymentMethodId,
  //     bank_id,
  //     account_number,
  //     remarks: remark || "",
  //     reference_date,
  //     student_fee_details_ids,
  //     late_fee: exact("late_fee"),
  //     readmission_fees: exact("readmission_fees"),
  //     discount_fee: exact("discount_fee"),
  //     check_bounce_fee: exact("check_bounce_fee"),
  //     total_amount: Number(paidAmount) || 0,
  //   };

  //   console.log("Payload sent →", payload);

  //   const confirmed = window.confirm(
  //     "Are you sure you want to create Fee Receipt?"
  //   );
  //   if (!confirmed) return;

  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     const result = await response.json();

  //     if (response.ok && result.message?.includes("Success")) {
  //       alert("Fee receipt created successfully!");
  //       await generatePDF(result.receipt_data);
  //       handleClear();
  //     } else {
  //       alert(result?.message || JSON.stringify(result));
  //     }
  //   } catch (err) {
  //     alert("Something went wrong while saving receipt.");
  //   }
  // };

  // ---------------- PDF GENERATION FUNCTION ----------------

  const handleSave = async () => {
    const apiUrl = `${ApiUrl.apiurl}FeeReceipt/FeeReceiptCreate/`;

    const organization_id = Number(sessionStorage.getItem("organization_id"));
    const branch_id = Number(sessionStorage.getItem("branch_id"));
    const batch_id = Number(selectedSession?.value);
    const course_id = Number(selectedCourse?.value);
    const department_id = Number(selectedDepartment?.value);
    const academic_year_id = Number(selectedAcademicYear?.value);

    // ✅ FIXED: Get semester_id from selectedFeeDetails NOT dropdown
    const semester_ids = [
      ...new Set(
        selectedFeeDetails
          .map((x) => Number(x.period_id))
          .filter((id) => !isNaN(id))
      ),
    ];

    const login_id = Number(sessionStorage.getItem("userId"));
    const student_id = Number(selectedStudentId);

    const receipt_date = dateRef.current.value;
    const reference_date = selectedDate.toISOString().slice(0, 10);

    const student_fee_details_ids = selectedFeeDetails.flatMap(
      (x) => x.all_ids || [x.id ?? x.fee_detail_id]
    );

    const exact = (key) => {
      const value = charges[key];
      if (value === undefined || value === null || value === "") {
        return 0;
      }
      return Number(value);
    };

    // Get payment method label
    const selectedPaymentLabel = paymentMethodOptions.find(
      (o) => o.value === selectedPaymentMethodId
    )?.label?.toLowerCase() || "";

    // ✅ PAYMENT METHOD VALIDATION & PAYMENT DETAIL OBJECT CONSTRUCTION
    let payment_detail = {
      payment_type: selectedPaymentLabel || "cash",
      reference_date: reference_date,
      total_amount: Number(paidAmount) || 0,
      reference: remark || "",
    };

    // Cheque Payment
    if (selectedPaymentLabel === "cheque") {
      if (!chequeNumber || !chequeBankName || !chequeBranchName) {
        alert("Please enter Cheque Number, Bank Name and Branch Name.");
        return;
      }
      if (!/^\d{6}$/.test(chequeNumber)) {
        alert("Cheque Number must be exactly 6 digits.");
        return;
      }
      payment_detail = {
        payment_type: "Cheque",
        cheque_number: Number(chequeNumber),
        cheque_bank_name: chequeBankName,
        cheque_branch_name: chequeBranchName,
        remarks: remark || "",
        reference_date: reference_date,
        reference: remark || "",
        total_amount: Number(paidAmount) || 0,
        ...(selectedBankId && { beneficiary_bank_id: Number(selectedBankId) }),
        ...(selectedAccountId && { beneficiary_account_id: Number(selectedAccountId) }),
      };
    }
    // Bank Transfer
    else if (selectedPaymentLabel === "bank") {
      payment_detail = {
        payment_type: "Bank",
        ...(selectedBankId && { beneficiary_bank_id: Number(selectedBankId) }),
        ...(selectedAccountId && { beneficiary_account_id: Number(selectedAccountId) }),
        reference_date: reference_date,
        total_amount: Number(paidAmount) || 0,
        reference: remark || "",
      };
    }
    // Cash Payment
    else if (selectedPaymentLabel === "cash") {
      payment_detail = {
        payment_type: "Cash",
        reference_date: reference_date,
        total_amount: Number(paidAmount) || 0,
        reference: remark || "",
      };
    }
    // Demand Draft (DD)
    else if (selectedPaymentLabel === "dd" || selectedPaymentLabel === "demand draft") {
      if (!ddNumber || !ddIssuingBank) {
        alert("Please enter DD Number and Issuing Bank.");
        return;
      }
      if (!/^\d{6}$/.test(ddNumber)) {
        alert("DD Number must be exactly 6 digits.");
        return;
      }
      payment_detail = {
        payment_type: "dd",
        dd_number: ddNumber,
        issuing_bank_name: ddIssuingBank,
        ...(selectedBankId && { beneficiary_bank_id: Number(selectedBankId) }),
        ...(selectedAccountId && { beneficiary_account_id: Number(selectedAccountId) }),
        reference_date: reference_date,
        total_amount: Number(paidAmount) || 0,
        reference: remark || "",
      };
    }
    // RTGS/NEFT
    else if (selectedPaymentLabel.includes("rtgs") || selectedPaymentLabel.includes("neft")) {
      if (!rtgsUtrNo || !rtgsSenderBank || !rtgsAccountNo) {
        alert("Please enter UTR No, Sender Bank and Account No for RTGS/NEFT.");
        return;
      }
      if (!/^\d{22}$/.test(rtgsUtrNo)) {
        alert("UTR Number must be exactly 22 digits.");
        return;
      }
      payment_detail = {
        payment_type: "rtgs_neft",
        utr_number: rtgsUtrNo,
        sender_bank_name: rtgsSenderBank,
        account_number: rtgsAccountNo,
        ...(selectedBankId && { beneficiary_bank_id: Number(selectedBankId) }),
        ...(selectedAccountId && { beneficiary_account_id: Number(selectedAccountId) }),
        reference_date: reference_date,
        total_amount: Number(paidAmount) || 0,
        reference: remark || "",
      };
    }
    // UPI
    else if (selectedPaymentLabel.includes("upi")) {
      if (!upiUtrNo) {
        alert("Please enter UTR No for UPI payment.");
        return;
      }
      if (!/^\d{22}$/.test(upiUtrNo)) {
        alert("UTR Number must be exactly 22 digits.");
        return;
      }
      payment_detail = {
        payment_type: "upi",
        utr_number: upiUtrNo,
        ...(selectedBankId && { beneficiary_bank_id: Number(selectedBankId) }),
        ...(selectedAccountId && { beneficiary_account_id: Number(selectedAccountId) }),
        reference_date: reference_date,
        total_amount: Number(paidAmount) || 0,
        reference: remark || "",
      };
    }

    const payload = {
      organization_id,
      branch_id,
      batch_id,
      course_id,
      department_id,
      academic_year_id,
      semester_ids,
      login_id,
      student_id,
      receipt_date,
      payment_method_id: selectedPaymentMethodId,
      student_fee_details_ids,
      late_fee: exact("late_fee"),
      readmission_fees: exact("readmission_fees"),
      discount_fee: exact("discount_fee"),
      check_bounce_fee: exact("check_bounce_fee"),
      remarks: paymentRemark || "",
      payment_detail: payment_detail,
    };

    console.log("DEBUG - Charges object:", charges);
    console.log("DEBUG - exact('discount_fee'):", exact("discount_fee"));
    console.log("Payload sent →", payload);

    const confirmed = window.confirm(
      "Are you sure you want to create Fee Receipt?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.message?.includes("Success")) {
        alert("Fee receipt created successfully!");
        await generatePDF(result.receipt_data);
        handleClear();
      } else {
        alert(result?.message || JSON.stringify(result));
      }
    } catch (err) {
      alert("Something went wrong while saving receipt.");
    }
  };

  const generatePDF = async (data) => {
    const doc = new jsPDF("portrait", "mm", "a4");
    const safe = (v) => (v === null || v === undefined ? "" : v);
    const pageWidth = doc.internal.pageSize.getWidth();

    // HEADER
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("FEE RECEIPT", pageWidth / 2, 15, { align: "center" });

    // MAIN DETAILS TABLE
    const receiptDetails = [
      [
        "Receipt No",
        safe(data.receipt_no),
        "Receipt Date",
        safe(data.receipt_date),
      ],
      [
        "Student Name",
        safe(data.student_name),
        "Admission No",
        safe(data.admission_no),
      ],
      ["Course", safe(data.course_name), "Section", safe(data.section_name)],
      [
        "Academic Year",
        safe(data.academic_year),
        "Father's Name",
        safe(data.father_name),
      ],
    ];

    doc.autoTable({
      startY: 25,
      body: receiptDetails,
      theme: "grid",
      styles: { fontSize: 10 },
      tableWidth: 190,
      margin: { left: 10 },
    });

    // FEE ELEMENT BREAKUP
    const elements = [];
    const paymentObj = data.payment_element_list || {};

    Object.keys(paymentObj).forEach((key, index) => {
      const row = paymentObj[key];
      elements.push([
        index + 1,
        safe(row.element_name),
        Number(row.amount || 0).toFixed(2),
      ]);
    });

    elements.push(["", "Total Paid", Number(data.amount || 0).toFixed(2)]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Sr", "Fee Element", "Amount"]],
      body: elements,
      theme: "grid",
      styles: { fontSize: 10 },
      columnStyles: { 2: { halign: "right" } },
      margin: { left: 10 },
      tableWidth: 190,
    });

    // ------------------------------------------
    // ✅ ADD OTHER CHARGES TABLE (NEW)
    // ------------------------------------------

    // doc.autoTable({
    //   startY: doc.lastAutoTable.finalY + 8,
    //   head: [["Other Charges", "Amount"]],
    //   // body: otherCharges,
    //   theme: "grid",
    //   styles: { fontSize: 10 },
    //   columnStyles: { 1: { halign: "right" } },
    //   margin: { left: 10 },
    //   tableWidth: 190,
    // });

    // PAYMENT DETAILS
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Payment Method", "Reference", "Remark", "Amount"]],
      body: [
        [
          safe(data.payment_method),
          safe(data.payment_reference || "-"),
          safe(data.remarks || "-"),
          Number(data.amount || 0).toFixed(2),
        ],
      ],
      theme: "grid",
      styles: { fontSize: 10 },
      columnStyles: { 3: { halign: "right" } },
      margin: { left: 10 },
      tableWidth: 190,
    });

    // SUMMARY TABLE
    const summary = [
      [
        "Total Academic Year Fee",
        Number(data.total_academic_year_fees || 0).toFixed(2),
      ],
      ["Total Paid", Number(data.total_paid || 0).toFixed(2)],
      ["Balance Remaining", Number(data.remaining_amount || 0).toFixed(2)],
    ];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      body: summary,
      theme: "grid",
      styles: { fontSize: 10, fontStyle: "bold" },
      columnStyles: { 1: { halign: "right" } },
      margin: { left: 10 },
      tableWidth: 190,
    });

    // FOOTER
    doc.setFontSize(9);
    doc.text(
      "This is a system-generated fee receipt. No signature is required.",
      10,
      doc.lastAutoTable.finalY + 10
    );

    // AUTO DOWNLOAD
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  const handleMainCheckboxChange = (row, index) => {
    const isSelected = selectedPeriods.includes(index);

    if (isSelected) {
      // REMOVE period and all fee heads of that period
      setSelectedPeriods(selectedPeriods.filter((i) => i !== index));

      setSelectedFeeDetails((prev) =>
        prev.filter((detail) => detail.period !== row.period)
      );
    } else {
      // Get all fee heads under this period
      const detailsForPeriod = aggregatedFeeDetails
        .filter((d) => d.period === row.period && parseFloat(d.balance) > 0)
        .map((d) => ({
          id: d.id,
          all_ids: d.all_ids || [d.id],
          period: d.period,
          element_name: d.element_name,
          period_id: d.period_id,
          paid: d.paid_amount,
          balance: parseFloat(d.balance),
          due: d.element_amount,
        }));

      setSelectedPeriods([...selectedPeriods, index]);

      // ADD WITHOUT DUPLICATES
      setSelectedFeeDetails((prev) => {
        const merged = [...prev];

        detailsForPeriod.forEach((item) => {
          const exists = merged.some(
            (d) =>
              d.period === item.period && d.element_name === item.element_name
          );
          if (!exists) merged.push(item);
        });

        return merged;
      });
    }
  };

  const handleNestedCheckboxChange = (item, row) => {
    setSelectedFeeDetails((prev) => {
      const exists = prev.some(
        (d) => d.period === row.period && d.element_name === item.element_name
      );

      if (exists) {
        // REMOVE ITEM
        return prev.filter(
          (d) =>
            !(d.period === row.period && d.element_name === item.element_name)
        );
      }

      // ADD ITEM (NO DUPLICATES)
      return [
        ...prev,
        {
          id: item.id,
          all_ids: item.all_ids || [item.id],
          period: row.period,
          element_name: item.element_name,
          period_id: item.period_id,
          paid: parseFloat(item.paid_amount),
          balance: parseFloat(item.balance),
          due: parseFloat(item.element_amount),
        },
      ];
    });
  };

  // Helper function to group and sum fee details by element_name and period_month
  const aggregateFeeDetails = (feeDetails) => {
    const map = {};

    feeDetails.forEach((item) => {
      const key = `${item.semester}-${item.element_name}`;

      if (!map[key]) {
        map[key] = {
          id: item.id,
          all_ids: [item.id],
          period: item.semester,
          period_id: item.semester_id,
          element_name: item.element_name,
          element_amount: Number(item.element_amount) || 0,
          paid_amount: Number(item.paid_amount) || 0,
        };
      } else {
        map[key].all_ids.push(item.id);
        map[key].element_amount += Number(item.element_amount) || 0;
        map[key].paid_amount += Number(item.paid_amount) || 0;
      }

      map[key].balance = map[key].element_amount - map[key].paid_amount;
    });

    return Object.values(map);
  };

  useEffect(() => {
    if (feeDetails.length > 0) {
      setAggregatedFeeDetails(aggregateFeeDetails(feeDetails));
      setUniquePeriods(getUniquePeriods(feeDetails));
    }
  }, [feeDetails]);

  useEffect(() => {
    fetchStudentData();
  }, []);

  // Helper to get unique periods with summed total and balance amounts
  const getUniquePeriods = (feeDetails) => {
    if (!Array.isArray(feeDetails) || feeDetails.length === 0) return [];

    const periodMap = new Map();

    feeDetails.forEach((detail) => {
      const period = detail.semester;
      const elementAmount = Number(detail.element_amount) || 0;
      const paidAmount = Number(detail.paid_amount) || 0;

      if (!periodMap.has(period)) {
        periodMap.set(period, {
          period,
          totalAmount: elementAmount,
          paidAmount: paidAmount,
          discount: 0,
        });
      } else {
        const existing = periodMap.get(period);
        existing.totalAmount += elementAmount;
        existing.paidAmount += paidAmount;
      }
    });

    return Array.from(periodMap.values()).map((p) => ({
      ...p,
      totalAmount: Number(p.totalAmount),
      paidAmount: Number(p.paidAmount),
      balanceAmount: Number(p.totalAmount - p.paidAmount),
    }));
  };

  // const uniquePeriods = getUniquePeriods(feeDetails);

  useEffect(() => {
    // Get unique periods from feeDetails
    const uniquePeriodsData = getUniquePeriods(feeDetails);
    setUniquePeriods(uniquePeriodsData);
  }, [feeDetails]);

  const navigate = useNavigate();

  const dateRef = useRef(null);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSelectStudent = async (selectedStudent) => {
    try {
      // Safely extract student_id
      const studentId =
        selectedStudent?.fullData?.student ||
        selectedStudent?.studentBasicDetails?.student_id ||
        selectedStudent?.student_id ||
        null;

      if (!studentId) {
        console.error("No valid student ID found in selected student");
        return;
      }

      //  Store student_id for persistence
      localStorage.setItem(
        "selectedClubStudentId",
        JSON.stringify({ student_id: studentId })
      );

      console.log(" Stored student_id in localStorage:", studentId);

      //  Fetch full details from the API
      await fetchStudentDetails(studentId);

      //  Close modal
      handleCloseModal();
    } catch (error) {
      console.error(" Error handling selected student:", error);
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
          id: student.id,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value, "hii");
    setCharges((prevCharges) => ({
      ...prevCharges,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!isUserInput) {
      setPaidAmount(totalDues + totalOtherCharges);
    }
  }, [totalDues, totalOtherCharges, isUserInput]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    dateRef.current.value = today; // Set the default value
  }, []);

  const handleCloseButton = () => {
    navigate("/admin/fee-search");
  };

  useEffect(() => {
    if (studentBarcode || schoolAdmissionNo || studentName) {
      fetchStudentData();
    }
  }, [studentBarcode, schoolAdmissionNo, studentName]);

  useEffect(() => {
    if (
      selectedStudent.id ||
      selectedStudent.barcode ||
      selectedStudent.admissionNo
    ) {
      // Clear previous selections before loading new student data
      setSelectedPeriods([]);
      setSelectedFeeDetails([]);

      fetchStudentData({
        id: selectedStudent.id,
        barcode: selectedStudent.barcode,
        admissionNo: selectedStudent.admissionNo,
      });
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (selectedFeeDetails.length > 0) {
      // Sum up all the balance amounts from the selectedFeeDetails array
      const totalBalanceAmount = selectedFeeDetails.reduce(
        (total, feeDetail) => total + (feeDetail.balance || 0),
        0
      );

      // Set the summed balance as the value for Amount and Paid Amount fields
      setSelectedAmount(totalBalanceAmount);
      setPaidAmount(totalBalanceAmount);
    }
  }, [selectedFeeDetails]);

  // Handler for updating the amount field
  const handleAmountChange = (event) => {
    const value = parseFloat(event.target.value) || 0; // Ensure the value is a number (default to 0 if invalid)
    setSelectedAmount(value);
    setPaidAmount(value); // Update Paid Amount when Amount changes
  };

  // Calculate balance when gross amount or paid amount changes
  useEffect(() => {
    const grossAmount = totalDues + totalOtherCharges;
    setBalance(grossAmount - paidAmount);
  }, [totalDues, totalOtherCharges, paidAmount]);

  // Sync SelectedAmount whenever PaidAmount changes
  useEffect(() => {
    setSelectedAmount(paidAmount);
  }, [paidAmount]);

  const handlePaidAmountChange = (e) => {
    const newPaidAmount = parseFloat(e.target.value) || 0;
    setPaidAmount(newPaidAmount);
  };

  const selectedPaymentMethodLabel = paymentMethodOptions.find(
    (o) => o.value === selectedPaymentMethodId
  )?.label?.toLowerCase() || "";

  return (
    <div className="container-fluid ">
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
                FEE COLLECTION
              </p>
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    style={{
                      width: "150px",
                    }}
                    onClick={handleSave}
                  >
                    Save
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
                    onClick={handleCloseButton}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="row mt-3 mx-2 mb-4 ">
                <div className="col-12 custom-section-box">
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="row flex-grow-1">
                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="date" className="form-label">
                          Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          className="form-control detail"
                          ref={dateRef}
                        />
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <label htmlFor="student-barcode" className="form-label">
                          Student BarCode
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-barcode"
                            className="form-control detail"
                            placeholder="Enter student barcode"
                            value={selectedStudent.barcode || ""}
                            onChange={(e) =>
                              setSelectedStudent((prev) => ({
                                ...prev,
                                barcode: e.target.value,
                              }))
                            }
                            onBlur={fetchStudentData}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label
                          htmlFor="school-admission-no"
                          className="form-label "
                        >
                          School Admission No
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="school-admission-no"
                            className="form-control detail"
                            placeholder="Enter school admission no"
                            value={selectedStudent.admissionNo || ""}
                            onChange={(e) =>
                              setSelectedStudent((prev) => ({
                                ...prev,
                                admissionNo: e.target.value,
                              }))
                            }
                            onBlur={fetchStudentData}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <label htmlFor="student-name" className="form-label">
                          Student Name
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            id="student-name"
                            className="form-control detail"
                            placeholder="Enter student name"
                            value={selectedStudent.name || ""}
                            onChange={(e) =>
                              setSelectedStudent((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            onBlur={fetchStudentData}
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
                      </div>
                      <SelectStudentFeeModal
                        show={showModal}
                        handleClose={handleCloseModal}
                        onSelectStudent={handleSelectStudent}
                      />
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

                      <div className="col-12 col-md-3 mb-4">
                        <label htmlFor="fee-group" className="form-label">
                          Fee Group
                        </label>
                        <Select
                          id="fee-group"
                          className="detail"
                          value={{ label: feeGroup, value: feeGroup }}
                          options={[]}
                          placeholder="Select Fee Group"
                          // classNamePrefix="react-select"
                          isDisabled={false} // Set to false to allow selection if needed
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mx-2">
                <div className="col-md-6" style={{ border: "1px solid #ccc" }}>
                  <h4>Fee Period Details</h4>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-header">
                        <tr>
                          <th></th>
                          <th>Semester</th>
                          <th>Total Amount</th>
                          <th>Paid Amount</th>
                          <th>Discount</th>
                          <th>Balance Amount</th>
                          <th>Pay</th>
                        </tr>
                      </thead>

                      <tbody>
                        {uniquePeriods.map((row, index) => (
                          <React.Fragment key={index}>
                            <tr
                              className="highlight"
                              onClick={() => handleRowClick(index)}
                            >
                              <td>
                                <FaPlus style={{ cursor: "pointer" }} />
                              </td>
                              <td>{row.period}</td>
                              <td>{row.totalAmount}</td>
                              <td>{row.paidAmount}</td>
                              <td>{row.discount}</td>
                              <td>{row.balanceAmount}</td>
                              <td>
                                {row.balanceAmount > 0 ? (
                                  <input
                                    type="checkbox"
                                    checked={selectedPeriods.includes(index)}
                                    onChange={() =>
                                      handleMainCheckboxChange(row, index)
                                    }
                                  />
                                ) : null}
                              </td>
                            </tr>
                            {expandedRow === index && (
                              <tr>
                                <td colSpan="7">
                                  <div className="table-responsive">
                                    <table className="table table-bordered">
                                      <thead>
                                        <tr>
                                          <th>Element Name</th>
                                          <th>Amount</th>
                                          <th>Paid</th>
                                          <th>Balance</th>
                                          <th>Pay</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {aggregatedFeeDetails
                                          .filter(
                                            (detail) =>
                                              detail.period === row.period
                                          )
                                          .map((item, subIndex) => (
                                            <tr key={subIndex}>
                                              <td>{item.element_name}</td>
                                              <td>
                                                {item.element_amount.toFixed(2)}
                                              </td>
                                              <td>
                                                {item.paid_amount.toFixed(2)}
                                              </td>
                                              <td>{item.balance}</td>
                                              <td>
                                                {parseFloat(item.balance) >
                                                  0 ? (
                                                  <input
                                                    type="checkbox"
                                                    checked={selectedFeeDetails.some(
                                                      (detail) =>
                                                        detail.period ===
                                                        row.period &&
                                                        detail.element_name ===
                                                        item.element_name
                                                    )}
                                                    onChange={() =>
                                                      handleNestedCheckboxChange(
                                                        item,
                                                        row
                                                      )
                                                    }
                                                  />
                                                ) : null}
                                              </td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-md-6" style={{ border: "1px solid #ccc" }}>
                  <h4>Fee Paid Details</h4>
                  <div className="table-responsive">
                    <table className="table table-bordered ">
                      <thead className="table-header">
                        <tr>
                          <th>Fee Period</th>
                          <th>Fee Heads</th>
                          <th>Due</th>
                          <th>Paid</th>
                          <th>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFeeDetails.map((detail, idx) => (
                          <tr key={idx}>
                            <td>{detail.period}</td>
                            <td>{detail.element_name}</td>
                            <td>
                              {detail.due ? detail.due.toFixed(2) : "0.00"}
                            </td>
                            <td>
                              {detail.paid ? detail.paid.toFixed(2) : "0.00"}
                            </td>
                            <td>
                              {detail.balance
                                ? detail.balance.toFixed(2)
                                : "0.00"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="row mx-2">
                <div className="col-md-6" style={{ border: "1px solid #ccc" }}>
                  <h4>Fee Details</h4>
                  <div className="table-responsive">
                    <table className="table table-bordered ">
                      <thead className="table-header">
                        <tr>
                          <th>Period</th>
                          <th>Fee Heads</th>
                          <th>Due</th>
                          <th>Paid</th>
                          <th>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uniquePeriods
                          .filter((row) => {
                            return Number(row.totalAmount) > 0; // Show all periods with fees
                          })
                          .map((row, index) => (
                            <React.Fragment key={index}>
                              {aggregatedFeeDetails
                                .filter(
                                  (detail) => detail.period === row.period && detail.paid_amount > 0
                                )
                                .map((item, subIndex) => (
                                  <tr key={subIndex}>
                                    <td>{row.period}</td>
                                    <td>{item.element_name}</td>
                                    <td>{item.element_amount.toFixed(2)}</td>
                                    <td>{item.paid_amount.toFixed(2)}</td>
                                    <td>{item.balance.toFixed(2)}</td>
                                  </tr>
                                ))}
                            </React.Fragment>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-md-6" style={{ border: "1px solid #ccc" }}>
                  <h4>Payment Details</h4>
                  <form className="row g-3">
                    {/* Payment Method */}
                    <div className="col-md-3">
                      <label htmlFor="paymentMethod" className="form-label">
                        Payment Method
                      </label>

                      <Select
                        id="paymentMethod"
                        className="detail"
                        options={paymentMethodOptions}
                        classNamePrefix="react-select"
                        isClearable={false}
                        placeholder="Select Method"
                        value={
                          paymentMethodOptions.find(
                            (option) => option.value === selectedPaymentMethodId
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          const newValue = selectedOption
                            ? selectedOption.value
                            : null;
                          setSelectedPaymentMethodId(newValue);

                          // Clear bank/account when Cash selected (ID 2) OR if label is 'Cash'
                          const label = selectedOption ? selectedOption.label : "";
                          if (newValue === 2 || label.toLowerCase() === "cash") {
                            setSelectedBankId(null);
                            setSelectedAccountId(null);
                          }

                          // Clear all method-specific fields when payment method changes
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
                    {selectedPaymentMethodLabel === "cheque" && (
                      <>
                        <div className="col-md-3">
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

                        <div className="col-md-3">
                          <label className="form-label"> Cheque Bank Name</label>
                          <input
                            type="text"
                            className="form-control detail"
                            value={chequeBankName}
                            onChange={(e) => setChequeBankName(e.target.value)}
                            placeholder="Cheque Bank Name"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label">  Cheque Branch Name</label>
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
                    {selectedPaymentMethodLabel === "dd" && (
                      <>
                        <div className="col-md-3">
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

                        <div className="col-md-3">
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
                    {selectedPaymentMethodLabel.includes("upi") && (
                      <div className="col-md-3">
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
                    {(selectedPaymentMethodLabel.includes("rtgs") ||
                      selectedPaymentMethodLabel.includes("neft")) && (
                        <>
                          <div className="col-md-3">
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

                          <div className="col-md-3">
                            <label className="form-label">Sender Bank</label>
                            <input
                              type="text"
                              className="form-control detail"
                              value={rtgsSenderBank}
                              onChange={(e) => setRtgsSenderBank(e.target.value)}
                              placeholder="Sender Bank"
                            />
                          </div>


                          <div className="col-md-3">
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

                    {/* Bank Name */}
                    <div className="col-md-3">
                      <label htmlFor="bankName" className="form-label">
                        Bank Name
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        className="detail"
                        options={bankOptions}
                        placeholder="Select Bank"
                        value={
                          selectedBankId
                            ? bankOptions.find(
                              (option) => option.value === selectedBankId
                            )
                            : null
                        }
                        onChange={(selectedOption) =>
                          setSelectedBankId(
                            selectedOption ? selectedOption.value : null
                          )
                        }
                        isDisabled={selectedPaymentMethodLabel === "cash"}
                      />
                    </div>

                    {/* Account Name */}
                    <div className="col-md-3 ">
                      <label htmlFor="accountName" className="form-label">
                        Account Number
                      </label>
                      <Select
                        id="accountName"
                        className="detail"
                        options={accountNumberOptions}
                        classNamePrefix="react-select"
                        placeholder="Select Account"
                        isClearable={false}
                        isDisabled={selectedPaymentMethodLabel === "cash"}
                        value={
                          selectedAccountId
                            ? accountNumberOptions.find(
                              (option) => option.value === selectedAccountId
                            )
                            : null
                        }
                        onChange={(selectedOption) =>
                          setSelectedAccountId(
                            selectedOption ? selectedOption.value : null
                          )
                        }
                      />
                    </div>


                    {/* Reference Date */}
                    <div className="col-md-3">
                      <label htmlFor="referenceDate" className="form-label">
                        Reference Date
                      </label>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy/MM/dd"
                        className="form-control detail"
                        id="referenceDate"
                      />
                    </div>

                    {/* Amount */}
                    <div className="col-md-3 mb-3">
                      <label htmlFor="amount" className="form-label">
                        Amount
                      </label>
                      <input
                        type="number"
                        className="form-control detail"
                        id="amount"
                        // value={selectedAmount} // Automatically set the Amount to the selected "Due" value

                        value={selectedAmount === 0 ? "" : selectedAmount} // Default to empty string if the amount is 0
                        onChange={handleAmountChange} // Allow the user to change the value
                      />
                    </div>

                    {/* Reference */}
                    <div className="col-md-3">
                      <label htmlFor="reference" className="form-label">
                        Reference
                      </label>
                      <input
                        type="text"
                        className="form-control detail"
                        id="reference"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                      />
                    </div>

                    {/* Remark */}
                    <div className="col-md-3">
                      <label htmlFor="paymentRemark" className="form-label">
                        Remark
                      </label>
                      <textarea
                        className="form-control detail"
                        id="paymentRemark"
                        rows="2"
                        placeholder="Enter remark (optional)"
                        value={paymentRemark}
                        onChange={(e) => setPaymentRemark(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6"></div>

                {/* <!-- Other Charges --> */}
                <div className="col-md-3" style={{ border: "1px solid #ccc" }}>
                  <h4>Other Charges</h4>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        {[
                          { label: "Late Fee", key: "late_fee" },
                          { label: "ReAdmission", key: "readmission_fees" },
                          { label: "Discount", key: "discount_fee" },
                          { label: "Cheque Bounce", key: "check_bounce_fee" },
                        ].map((item, index) => (
                          <tr key={index}>
                            <td className="align-middle">{item.label}</td>

                            <td className="d-flex align-items-center">
                              {/* Checkbox */}
                              <input
                                type="checkbox"
                                className="me-2"
                                checked={charges[item.key] !== undefined}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCharges((prev) => ({
                                      ...prev,
                                      [item.key]: "", // Start as empty string (user controlled)
                                    }));
                                  } else {
                                    const cp = { ...charges };
                                    delete cp[item.key];
                                    setCharges(cp);
                                  }
                                }}
                              />

                              {/* Input */}
                              <input
                                type="number"
                                className="form-control form-control-sm w-auto"
                                value={charges[item.key] ?? ""}
                                disabled={charges[item.key] === undefined}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setCharges((prev) => ({
                                    ...prev,
                                    [item.key]: value, // Store RAW value (do NOT convert)
                                  }));
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* <h6 style={{ fontWeight: 700 }}>Send SMS</h6>
                  <div
                    className="form-check d-flex justify-content-center align-items-center"
                    style={{ border: "1px solid #ccc", padding: "10px" }}
                  >
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      id="sendSMS"
                    />
                    <label className="form-check-label" htmlFor="sendSMS">
                      Send SMS
                    </label>
                  </div> */}
                </div>

                {/* <!-- Totals --> */}
                <div class="col-md-3" style={{ border: "1px solid #ccc" }}>
                  <h4>Totals</h4>
                  <div className="table-responsive">
                    <table className="table table-bordered ">
                      <tbody>
                        <tr>
                          <td>Total Dues</td>
                          <td>
                            <input
                              type="text"
                              className="form-control detail"
                              value={totalDues.toFixed(2)} // Total Dues
                              readOnly
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Service Charges</td>
                          <td>
                            <input
                              type="text"
                              className="form-control detail"
                              value="0.00" // Placeholder for service charges, modify if needed
                              readOnly
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Total Other Charges</td>
                          <td>
                            <input
                              type="text"
                              className="form-control detail"
                              value={totalOtherCharges.toFixed(2)}
                              readOnly
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Gross Amount</td>
                          <td>
                            <input
                              type="text"
                              className="form-control detail"
                              value={(totalDues + totalOtherCharges).toFixed(2)} // Gross Amount (Total Dues + other charges)
                              readOnly
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Paid Amount</td>
                          <td>
                            <input
                              type="text"
                              className="form-control detail"
                              value={paidAmount.toFixed(2)}
                              onChange={handlePaidAmountChange} // Paid Amount
                              // value={(totalDues + totalOtherCharges).toFixed(2)}
                              readOnly
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Balance</td>
                          <td>
                            <input
                              type="text"
                              className="form-control detail"
                              value={balance.toFixed(2)} // Balance (Gross Amount - Paid Amount)
                              readOnly
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* <div class="row">
                <div class="col-md-6"></div>
                <div class="col-md-6" style={{ border: "1px solid #ccc" }}>
                  <div class="mb-3">
                    <label for="exampleFormControlTextarea1" class="form-label">
                      Remarks
                    </label>
                    <textarea
                      class="form-control"
                      id="exampleFormControlTextarea1"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeCollection;