
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminNavbarNavbar from "./Bars/AdminNavbar";
import Sidebar from "./Bars/Sidebar";
import Login from "./pages/Login/Login";
import StudentNavbar from "./Bars/StudentNavbar";
import StaffNavbar from "./Bars/StaffNavbar";
import AdminNavbar from "./Bars/AdminNavbar";
import Dashboard from "./pages/StaffPannel/Dashboard";
import ViewResult from "./pages/StudentPannel/ViewResult";
import AdmStaffDetails from "./components/AdminTabs/AdminEmployeeSearch/AdmStaffDetails";
import ViewAttendance from "./pages/StudentPannel/ViewAttendance";
import StaffChangePassword from "./components/StaffTabs/StaffChangePassword/StaffChangePassword";

import Dashboards from "./pages/StudentPannel/Dashboards";

import LeaveSheet from "./pages/StaffPannel/LeaveSheet";
import Notification from "./pages/StaffPannel/Notification";
import ResultPublish from "./pages/StaffPannel/ResultPublish";
import SendFeedback from "./pages/StaffPannel/SendFeedback";
import StaffFollowUp from "./pages/StaffPannel/StaffFollowUp";
import StaffNewFollowUp from "./pages/StaffPannel/StaffNewFollowUp";
import TakeStudentAttendance from "./pages/StaffPannel/TakeStudentAttendance";
import ViewStudentAttendance from "./pages/StaffPannel/ViewStudentAttendance";
import UploadAssignment from "./pages/StaffPannel/UploadAssignment";
import HolidayCalender from "./pages/StaffPannel/HolidayCalender";
import StaffDocumentUpload from "./pages/StaffPannel/DocumentUpload";
import HolidayList from "./pages/StudentPannel/HolidayList";
import Assignment from "./pages/StudentPannel/Assignment";
import LoginPage from "./pages/Login/LoginPage";
import Payment from "./pages/StudentPannel/Payment";
import DashBoards from "./pages/AdminPanel/DashBoards";

import ClassWithSubjectAndClass from "./pages/StaffPannel/ClassWithSubjectAndClass";

import AttendanceEntry from "./pages/AdminPanel/AttendanceEntry";
import AttendanceUpdate from "./pages/AdminPanel/AttendanceUpdate";
import Registration from "./pages/AdminPanel/Registration";
import AdmStudentRegistration from "./components/AdminTabs/AdminRegistration/AdmStudentRegistration";
import StudentLocationStatsPage from "./pages/AdminPanel/StudentLocationStatsPage";
import BonafideCertificate from "./components/AdminTabs/AdminStudentCertificate/BonafideCertificate";
import AdmAssignmentEntry from "./components/AdminTabs/AdmAssignmentEntry/AdmAssignmentEntry";
import StudentPromotion from "./pages/AdminPanel/StudentPromotion";

import StudentClass from "./pages/AdminPanel/StudentClass";
import StudentConfirm from "./pages/AdminPanel/StudentConfirm";
import StudentCertificate from "./pages/AdminPanel/StudentCertificate";

import StudentMessage from "./pages/AdminPanel/StudentMessage";
import AdmStudentMessageList from "./components/AdminTabs/AdminStudentMessage/AdmStudentMessageList";
import StudentClub from "./pages/AdminPanel/StudentClub";
import EmployeeSearch from "./pages/AdminPanel/EmployeeSearch";


import CircularEntry from "./pages/AdminPanel/CircularEntry";
import FeeSearch from "./pages/AdminPanel/FeeSearch";
import Circular from "./pages/StudentPannel/Circular";
import Events from "./pages/StudentPannel/Events";
import OnlineClass from "./pages/StudentPannel/OnlineClass";
import AdmStudentCircular from "./pages/AdminPanel/AdmStudentCircular";

import FeeDashBoard from "./pages/AdminPanel/FeeDashBoard";

import StudentTransportFee from "./pages/AdminPanel/StudentTransportFee";
import BookCategory from "./pages/AdminPanel/BookCategory";
import BookSearch from "./pages/AdminPanel/BookSearch";
import AdmBookMaster from "./components/AdminTabs/AdminBookSearch/AdmBookMaster";
import BookMovements from "./pages/AdminPanel/BookMovements";
import IssuePage from "./components/AdminTabs/AdminBookMovements/IssuePage ";
import PaymentDetails from "./components/AdminTabs/AdminFeeDashBoard/PaymentDetails";
import BulkReturnPage from "./components/AdminTabs/AdminBookMovements/BulkReturnPage ";
// import AttendanceDashboard from "./pages/AdminPanel/AttendanceDashboard";
import PartyMaster from "./pages/AdminPanel/PartyMaster";
import SearchExpense from "./pages/AdminPanel/SearchExpense";
import ExpenseCategory from "./pages/AdminPanel/ExpenseCategory";
import AdmAddExpense from "./components/AdminTabs/AdminSearchExpense/AdmAddExpense";
import ExpenseLedger from "./pages/AdminPanel/ExpenseLedger";
import ProfitAndLoss from "./pages/AdminPanel/ProfitAndLoss";
import DayBook from "./pages/AdminPanel/DayBook";
import SearchIncome from "./pages/AdminPanel/SearchIncome";
import AdmAddIncome from "./components/AdminTabs/AdminSearchIncome/AdmAddIncome";
import AdmEditIncome from "./components/AdminTabs/AdminSearchIncome/AdmEditIncome";
import FeeCollection from "./components/AdminTabs/AdminFeeSearch/FeeCollection";
import FeeLedger from "./pages/AdminPanel/FeeLedger";
import StudentFee from "./pages/AdminPanel/StudentFee";
import AdhocFee from "./pages/AdminPanel/AdhocFee";
import AttendanceDashboard from "./pages/AdminPanel/AttendanceDashboard";
import ClassExamResult from "./pages/AdminPanel/ClassExamResult";
import AdminResult from "./pages/AdminPanel/AdminResult";
import AddStudentExamData from "./components/AdminTabs/AdminResult/StaffAddStudentData";
import ViewStudentReport from "./components/AdminTabs/AdminResult/ViewStudentReport";
import StaffAddStudentData from "./components/StaffTabs/ResultPublish/StaffAddStudentData";
import AdmFeeStructure from "./components/AdminTabs/AdminFeeStructure/AdmFeeStructure";
import FeeStructure from "./pages/AdminPanel/FeeStructure";
import TransferCertificateForm from "./components/AdminTabs/AdminStudentCertificate/TransferCertificateForm";
import CharacterCertificate from "./components/AdminTabs/AdminStudentCertificate/CharacterCertificate";
import FeeCertificate from "./components/AdminTabs/AdminStudentCertificate/FeeCertificate";
import FeeCertificateEdit from "./components/AdminTabs/AdminStudentCertificate/FeeCertificateEdit";
import TransferCertificateFormEdit from "./components/AdminTabs/AdminStudentCertificate/TransferCertificateFormEdit";
import CharacterCertificateEdit from "./components/AdminTabs/AdminStudentCertificate/CharacterCertificateEdit";
import BonafideCertificateEdit from "./components/AdminTabs/AdminStudentCertificate/BonafideCertificateEdit";
import FeeCertificatePdf from "./components/AdminTabs/AdminStudentCertificate/FeeCertificatePdf";
import BonafideCertificatePdf from "./components/AdminTabs/AdminStudentCertificate/BonafideCertificatePdf";
import CharacterCertificatePdf from "./components/AdminTabs/AdminStudentCertificate/CharacterCertificatePdf";
import SchoolLeavingCertificate from "./components/AdminTabs/AdminStudentCertificate/SchoolLeavingCertificate";
import TransferCertificateFormView from "./components/AdminTabs/AdminStudentCertificate/TransferCertificateFormView";
import FeeCertificateView from "./components/AdminTabs/AdminStudentCertificate/FeeCertificateView";
import BonafideCertificateView from "./components/AdminTabs/AdminStudentCertificate/BonafideCertificateView";
import CharacterCertificateView from "./components/AdminTabs/AdminStudentCertificate/CharacterCertificateView";
import BookDashboard from "./pages/AdminPanel/BookDashboard";
import BookConfigurations from "./pages/AdminPanel/BookConfigurations";
import BookTitleReport from "./pages/AdminPanel/BookTitleReport";
// import JournalReport from "./pages/AdminPanel/JournalReport";
import BookAccessionReport from "./pages/AdminPanel/BookAccessionReport";
import JournalReport from "./pages/AdminPanel/JournalReport";
import IssueReturnReport from "./pages/AdminPanel/IssueReturnReport";
import IssueDamagedReport from "./pages/AdminPanel/IssueDamagedReport";
import MostCirculated from "./pages/AdminPanel/MostCirculated";
import BookBarcode from "./pages/AdminPanel/BookBarcode";
import HostelSearch from "./pages/AdminPanel/HostelSearch";
import AdmStudentHostelDetails from "./components/AdminTabs/AdminStudentHostelFee/AdmStudentHostelDetails";
import AdmStudentHostelCreate from "./components/AdminTabs/AdminStudentHostelFee/AdmStudentHostelCreate";
import StudentHostelFee from "./pages/AdminPanel/StudentHostelFee";
import ClassTimeTable from "./pages/AdminPanel/ClassTimeTable";
import TeacherTimeTable from "./pages/AdminPanel/TeacherTimeTable";
import AssignMentor from "./pages/AdminPanel/AssignMentor";
import FollowUps from "./pages/AdminPanel/FollowUps";
import MentorStudentDetails from "./pages/AdminPanel/MentorStudentDetails";
import DocumentUpload from "./pages/AdminPanel/DocumentUpload";
import StudentGrievances from "./pages/AdminPanel/StudentGrievances";
import VisitorList from "./pages/AdminPanel/VisitorList";
import AssignStudentMentor from "./components/AdminTabs/AdminAssignMentor/AssignStudentMentor";
import LessonPlan from "./pages/AdminPanel/LessonPlan";
import TeacherLessonPlan from "./pages/AdminPanel/TeacherLessonPlan";
import IncomeDetail from "./components/AdminTabs/AdminSearchIncome/IncomeDetail";
import Training from "./pages/AdminPanel/Trainings";
// import MOU from "./pages/AdminPanel/MOU";
import AdmMOUList from "./components/AdminTabs/AdminMOU/AdmMOUList";
import AdmNewMOU from "./components/AdminTabs/AdminMOU/AdmNewMOU";
import ExpenseEdit from "./components/AdminTabs/AdminSearchExpense/ExpenseEdit";
import TransportSearch from "./components/AdminTabs/AdminStudentTransportFee/TransportSearch";
import EditTransportModal from "./components/AdminTabs/AdminStudentTransportFee/EditTransportModal";
import AdmPlacement from "./components/AdminTabs/AdminTrainingAndPlacement/AdmPlacement";
import StGrievance from "./pages/StudentPannel/StGrievance";
import NewGrievance from "./components/StudentTabs/StudentGrievance/NewGrievance";
import AdmStdMentorCommunication from "./components/AdminTabs/AdminAssignMentor/AdmStdMentorCommunication";
import AdmNewVisitor from "./components/AdminTabs/AdminVisitorsList/AdmNewVisitor";
import StudentProfileCard from "./components/StudentTabs/StudentProfile/Stdprofile";
import StudentAddressDetails from "./components/StudentTabs/StudentAddressDetails/StudentAddressDetails";
import StudentChangePassword from "./components/StudentTabs/StudentChangePassword/StudentChangePassword";
import StudentMentorDetails from "./components/StudentTabs/StudentMentorDetails/StudentMentorDetails";
import StudentTimeTable from "./components/StudentTabs/StudentTimeTable/StudentTimeTable";
import StudentRegistrationForm from "./components/StudentTabs/StudentDetails/StudentDetails";
import LibraryDetails from "./pages/StudentPannel/LibraryDetails";
import LeaveDetails from "./pages/StudentPannel/LeaveDetails";
import PreEducation from "./pages/StudentPannel/PreEducation";
import RTGS from "./pages/StudentPannel/RTGS";
import DownloadDemandLetter from "./pages/StudentPannel/DownloadDemandLetter"
import StdTrainingPlacement from "./components/StudentTabs/StudentTrainingPlacement/StdTrainingPlacement";

import Inventory from "./pages/AdminPanel/Inventory";
import InventorySearch from "./pages/AdminPanel/InventorySearch";
import NewInventory from "./components/AdminTabs/AdminInventoryMgmt/AdmNewInventory";
import CreateAdminUserPage from "./pages/AdminPanel/CreateAdminUserPage";
import CreateNewAdminUser from "./components/AdminTabs/RoleManagement/CreateNewAdminUser";
import AdminChangePassword from "./components/AdminTabs/AdminChangePassword/AdminChangePassword";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    sessionStorage.setItem("userRole", role);
  };

  useEffect(() => {
    const storedUserRole = sessionStorage.getItem("userRole");
    if (storedUserRole) {
      setIsLoggedIn(true);
      setUserRole(storedUserRole);
    }
  }, []);

  return (
    <Router>
      {isLoggedIn && (
        <>
          {userRole === "student" && <StudentNavbar />}
          {userRole === "staff" && <StaffNavbar />}
          {(userRole === "principal" || userRole === "admin") && <AdminNavbar />}
          <Sidebar
            state={state}
            setState={setState}
            toggleDrawer={toggleDrawer}
          />
        </>
      )}

      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Login isLoggedIn={isLoggedIn} onLogin={(e) => handleLogin(e)} />
            }
          />
          <Route
            path="/login"
            element={
              <Login isLoggedIn={isLoggedIn} onLogin={(e) => handleLogin(e)} />
            }
          />
          {userRole === "student" && (
            <>
              <Route path="/student/dashboards" element={<Dashboards />} />
              <Route path="/student/view-result" element={<ViewResult />} />

              <Route
                path="/student/view-attendance"
                element={<ViewAttendance />}
              />

              <Route
                path="/student/StudentProfileCard"
                element={<StudentProfileCard />}
              />
              <Route
                path="/student/StudentAddressDetail"
                element={<StudentAddressDetails />}
              />
              <Route
                path="/student/StudentChangePassword"
                element={<StudentChangePassword />}
              />
              <Route
                path="/student/mentor-details"
                element={<StudentMentorDetails />}
              />
              <Route
                path="/student/time-table"
                element={<StudentTimeTable />}
              />
              <Route
                path="/student/StudentRegistrationForm"
                element={<StudentRegistrationForm />}
              />

              <Route path="/student/hostel-detail" element={<HolidayList />} />
              <Route path="/student/assignment" element={<Assignment />} />
              <Route path="/student/payment-gateway" element={<Payment />} />
              <Route path="/student/circular" element={<Circular />} />
              <Route path="/student/events" element={<Events />} />
              <Route path="/student/online-class" element={<OnlineClass />} />
              <Route path="/student/grievance" element={<StGrievance />} />
              <Route path="/student/new-grievance" element={<NewGrievance />} />

              <Route path="/student/library" element={<LibraryDetails />} />
              <Route path="/student/leave-detail" element={<LeaveDetails />} />
              <Route
                path="/student/previous-education"
                element={<PreEducation />}
              />
              <Route path="/student/submit-application" element={<RTGS />} />
              <Route
                path="/student/download-demand-letter"
                element={<DownloadDemandLetter />}
              />
              <Route
                path="/student/training-placement"
                element={<StdTrainingPlacement />}
              />
            </>
          )}
          {userRole === "staff" && (
            <>
              <Route path="/staff/dashboard" element={<Dashboard />} />
              <Route path="/staff/document-upload" element={<StaffDocumentUpload />} />
              <Route path="/staff/lesson-plan" element={<Notification />} />
              <Route
                path="/staff/assignment-entry"
                element={<ResultPublish />}
              />
              <Route path="/staff/exam-result" element={<SendFeedback />} />
              <Route
                path="/staff/add-student-data"
                element={<StaffAddStudentData />}
              />
              <Route
                path="/staff/view-student-report"
                element={<ViewStudentReport />}
              />
              <Route path="/staff/follow-up" element={<StaffFollowUp />} />
              <Route
                path="/staff/take-student-attendance"
                element={<TakeStudentAttendance />}
              />
              <Route
                path="/staff/staff-time-table"
                element={<ViewStudentAttendance />}
              />
              <Route
                path="/staff/staff-student-profile"
                element={<UploadAssignment />}
              />
              <Route
                path="/staff/holiday-calender"
                element={<HolidayCalender />}
              />
              <Route
                path="/staff/class-subject-student"
                element={<ClassWithSubjectAndClass />}
              />
              <Route
                path="/staff/student-mentor-communication"
                element={<StaffNewFollowUp />}
              />
              <Route
                path="/staff/change-password"
                element={<StaffChangePassword />}
              />
            </>
          )}
          {(userRole === "principal" || userRole === "admin") && (
            <>
              <Route path="/admin/dashboard" element={<DashBoards />} />
              <Route
                path="/admin/Attendance-entry"
                element={<AttendanceEntry />}
              />
              <Route
                path="admin/attendance-update"
                element={<AttendanceUpdate />}
              />
              <Route path="/admin/registration" element={<Registration />} />
              <Route path="/admin/student-location-stats" element={<StudentLocationStatsPage />} />
              <Route
                path="/admstudentregistration"
                element={<AdmStudentRegistration />}
              />
              <Route
                path="/bonafidecertificate"
                element={<BonafideCertificate />}
              />
              <Route
                path="/transfercertificateform"
                element={<TransferCertificateForm />}
              />
              <Route
                path="charactercertificate"
                element={<CharacterCertificate />}
              />
              <Route path="feecertificate" element={<FeeCertificate />} />
              <Route
                path="feecertificateedit"
                element={<FeeCertificateEdit />}
              />
              <Route path="feecertificatepdf" element={<FeeCertificatePdf />} />
              <Route
                path="transfercertificateformedit"
                element={<TransferCertificateFormEdit />}
              />
              <Route
                path="charactercertificateedit"
                element={<CharacterCertificateEdit />}
              />
              <Route
                path="bonafidecertificateedit"
                element={<BonafideCertificateEdit />}
              />
              <Route
                path="/bonafidecertificatepdf"
                element={<BonafideCertificatePdf />}
              />
              <Route
                path="/charactercertificatepdf"
                element={<CharacterCertificatePdf />}
              />
              <Route
                path="/transfercertificatepdf"
                element={<SchoolLeavingCertificate />}
              />
              <Route
                path="/transfercertificateformview"
                element={<TransferCertificateFormView />}
              />
              <Route
                path="/feecertificateview"
                element={<FeeCertificateView />}
              />
              <Route
                path="/bonafidecertificateview"
                element={<BonafideCertificateView />}
              />
              <Route
                path="/charactercertificateview"
                element={<CharacterCertificateView />}
              />
              <Route
                path="/admstudentregistration/:id"
                element={<AdmStudentRegistration />}
              />
              <Route path="/admbookMaster" element={<AdmBookMaster />} />
              <Route
                path="/admin/assignment-entry"
                element={<AdmAssignmentEntry />}
              />
              <Route
                path="/admin/student-promotion"
                element={<StudentPromotion />}
              />
              <Route path="/admin/student-class" element={<StudentClass />} />
              <Route
                path="/admin/student-confirm"
                element={<StudentConfirm />}
              />
              <Route
                path="/admin/student-certificate"
                element={<StudentCertificate />}
              />
              <Route
                path="/admin/student-message"
                element={<StudentMessage />}
              />
              <Route path="/admin/student-club" element={<StudentClub />} />
              <Route
                path="/admin/employee-Search"
                element={<EmployeeSearch />}
              />

              <Route path="/admin/circular-entry" element={<CircularEntry />} />
              <Route path="/admin/fee-search" element={<FeeSearch />} />
              <Route path="/admin/fee-structure" element={<FeeStructure />} />
              <Route path="/admin/book-dashboard" element={<BookDashboard />} />
              <Route
                path="/admin/book-Configurations"
                element={<BookConfigurations />}
              />
              <Route
                path="/admin/book-title-report"
                element={<BookTitleReport />}
              />
              <Route
                path="/admin/book-accession-report"
                element={<BookAccessionReport />}
              />
              <Route
                path="/admin/book-journal-report"
                element={<JournalReport />}
              />
              <Route
                path="/admin/book-issue-return-report"
                element={<IssueReturnReport />}
              />
              <Route
                path="/admin/book-issue-damaged-report"
                element={<IssueDamagedReport />}
              />
              <Route
                path="/admin/book-most-circulated"
                element={<MostCirculated />}
              />
              <Route path="/admin/fee-dashboard" element={<FeeDashBoard />} />
              <Route path="/admin/book-category" element={<BookCategory />} />
              <Route path="/admin/book-search" element={<BookSearch />} />
              <Route path="/admin/book-movements" element={<BookMovements />} />
              <Route path="/admin/book-barcode" element={<BookBarcode />} />
              <Route path="/issue-page" element={<IssuePage />} />
              <Route
                path="/admin/expense-category"
                element={<ExpenseCategory />}
              />
              <Route path="/paymentDetails" element={<PaymentDetails />} />
              <Route path="/admin/party-master" element={<PartyMaster />} />
              <Route path="/addexpense" element={<AdmAddExpense />} />
              <Route path="/admin/search-expense" element={<SearchExpense />} />
              <Route path="/admin/expense-ledger" element={<ExpenseLedger />} />
              <Route path="/admin/search-income" element={<SearchIncome />} />
              <Route path="/admin/addincome" element={<AdmAddIncome />} />
              <Route path="/admin/edit-income" element={<AdmEditIncome />} />
              <Route path="/admin/profit-loss" element={<ProfitAndLoss />} />
              <Route path="/admin/day-book" element={<DayBook />} />
              <Route path="/feecollection" element={<FeeCollection />} />
              <Route path="/admin/fee-ledger" element={<FeeLedger />} />
              <Route path="/admin/student-fee" element={<StudentFee />} />
              <Route path="/admin/adhoc-fees" element={<AdhocFee />} />
              <Route path="/AdmStaffDetails" element={<AdmStaffDetails />} />
              <Route path="/admin/result" element={<AdminResult />} />
              <Route
                path="/admin/add-student-data"
                element={<AddStudentExamData />}
              />
              <Route
                path="/admin/view-student-report"
                element={<ViewStudentReport />}
              />
              {/* <Route
                path="/admin/class-exam-result"
                element={<ClassExamResult />}
              /> */}
              <Route
                path="/admin/student-attendance-list"
                element={<AttendanceDashboard />}
              />
              <Route path="/bulk-return-page" element={<BulkReturnPage />} />
              <Route
                path="/admstudentmessagelist"
                element={<AdmStudentMessageList />}
              />
              <Route
                path="/admin/student-transport-fee"
                element={<StudentTransportFee />}
              />
              <Route
                path="/admin/student-circular"
                element={<AdmStudentCircular />}
              />
              <Route path="/admin/search-hostel" element={<HostelSearch />} />
              <Route
                path="/admin/student-hostel-fee"
                element={<StudentHostelFee />}
              />
              <Route
                path="/admin/student-hostel-details"
                element={<AdmStudentHostelDetails />}
              />
              <Route
                path="/admin/student-hostel-create"
                element={<AdmStudentHostelCreate />}
              />
              <Route
                path="/admin/class-time-table"
                element={<ClassTimeTable />}
              />
              <Route
                path="/admin/teacher-lesson-plan"
                element={<TeacherLessonPlan />}
              />
              <Route
                path="/admin/teacher-time-table"
                element={<TeacherTimeTable />}
              />
              <Route path="/admin/assign-mentor" element={<AssignMentor />} />
              <Route
                path="/admin/assign-student-mentor"
                element={<AssignStudentMentor />}
              />
              <Route path="/admin/follows-ups" element={<FollowUps />} />
              <Route
                path="/admin/student-mentor-communication"
                element={<AdmStdMentorCommunication />}
              />
              <Route
                path="/admin/student-details"
                element={<MentorStudentDetails />}
              />
              <Route
                path="/admin/document-upload"
                element={<DocumentUpload />}
              />
              <Route
                path="/admin/student-grievance"
                element={<StudentGrievances />}
              />
              <Route path="/admin/visitors-list" element={<VisitorList />} />
              <Route path="/admin/lesson-plan" element={<LessonPlan />} />
              <Route path="/admin/income-detail" element={<IncomeDetail />} />
              {/* <Route path="/admin/mou-list" element={<MOU />} /> */}
              <Route path="/admin/mou-list" element={<AdmMOUList />} />
              <Route path="/admin/new-mou" element={<AdmNewMOU />} />
              <Route path="/admin/training" element={<Training />} />
              <Route path="/admin/expense_edit" element={<ExpenseEdit />} />
              <Route
                path="/admin/transport-search"
                element={<TransportSearch />}
              />
              <Route
                path="/admin/edit-modal"
                element={<EditTransportModal />}
              />
              <Route path="/admin/placement" element={<AdmPlacement />} />
              <Route path="/admin/new-visitor" element={<AdmNewVisitor />} />
              <Route path="/admin/inventory" element={<Inventory />} />
              <Route
                path="/admin/inventory-search"
                element={<InventorySearch />}
              />
              <Route path="/admin/inventory-new" element={<NewInventory />} />
              <Route path="/admin/create-admin-user" element={<CreateAdminUserPage />} />
              <Route path="/admin/create-admin-user/new" element={<CreateNewAdminUser />} />
              <Route path="/admin/change-password" element={<AdminChangePassword />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
