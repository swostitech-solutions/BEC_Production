
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import { ApiUrl } from "../ApiUrl";
import { Select, MenuItem, FormControl, InputLabel, Grid } from "@mui/material";
function Navbar({ onLogout }) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [academicSession, setAcademicSession] = React.useState("");
  const [academicYears, setAcademicYears] = React.useState([]);
  const [currentDateTime, setCurrentDateTime] = React.useState(""); // State for date and time
  
  React.useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}AcademicYear/GetAllAcademicYear/`
        );
        const data = await response.json();
        if (data.message === "Success") {
          const formattedYears = data.data.map((year) => ({
            id: year.id,
            code: year.academic_year_code || year.academic_year_description,
            orgId: year.organization || null,
            branchId: year.branch_id || null,
            dateFrom: new Date(year.date_from),
            dateTo: new Date(year.date_to),
          }));
          setAcademicYears(formattedYears);

          const storedSessionId = localStorage.getItem("academicSessionId");
          let currentYearData = null;

          if (storedSessionId) {
            // Find session by stored ID
            currentYearData = formattedYears.find(
              (year) => year.id.toString() === storedSessionId
            );
          } else {
            // Find current session based on date
            const currentDate = new Date();
            currentYearData = formattedYears.find((year) => {
              return currentDate >= year.dateFrom && currentDate <= year.dateTo;
            });
          }

          if (currentYearData) {
            setAcademicSession(currentYearData.code);
            localStorage.setItem("academicSessionId", currentYearData.id);
            localStorage.setItem("orgId", currentYearData.orgId || "");
            localStorage.setItem("branchId", currentYearData.branchId || "");
            localStorage.setItem(
              "dateFrom",
              currentYearData.dateFrom.toISOString().split("T")[0]
            );

            // Find next session
            const nextYear = formattedYears.find(
              (year) => year.dateFrom > currentYearData.dateTo
            );
            if (nextYear) {
              localStorage.setItem("nextAcademicSessionId", nextYear.id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
      }
    };

    fetchAcademicYears();
  }, []);

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
      setCurrentDateTime(formattedDateTime);
    };
    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 1000); // Update time every second
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  const handleLogout = () => {
    const logoutConfirmed = window.confirm("Are you sure you want to logout?");
    if (logoutConfirmed) {
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("userTypeId");
      sessionStorage.removeItem("username");
      localStorage.clear();
      window.location.href = "/login";
    }
  };
  const handleSessionChange = (event) => {
    const selectedCode = event.target.value;
    setAcademicSession(selectedCode);
    const selectedYear = academicYears.find(
      (year) => year.code === selectedCode
    );
    if (selectedYear) {
      localStorage.setItem("academicSessionId", selectedYear.id);
      localStorage.setItem("orgId", selectedYear.orgId || "");
      localStorage.setItem("branchId", selectedYear.branchId || "");
      localStorage.setItem(
        "dateFrom",
        selectedYear.dateFrom.toISOString().split("T")[0]
      );
      const nextYearCode = `${parseInt(selectedYear.code.split("-")[0]) + 1}-${(
        parseInt(selectedYear.code.split("-")[1]) + 1
      )
        .toString()
        .slice(-2)}`;
      const nextYear = academicYears.find((year) => year.code === nextYearCode);
      if (nextYear) {
        localStorage.setItem("nextAcademicSessionId", nextYear.id);
      }
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ padding: 0 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            disableRipple
            disableFocusRipple
            onClick={() => setState({ ...state, left: true })}
            sx={{
              "&:hover": { backgroundColor: "transparent" }, // removes hover grey
            }}
          >
            <MenuIcon />
          </IconButton>
          <Grid
            container
            alignItems="center"
            justifyContent="end"
            sx={{ flexGrow: 1 }}
          >
    
            {/* Right: Date and Logout */}
            <Grid
              item
              xs={4}
              container
              justifyContent="flex-end"
              alignItems="center"
              sx={{ padding: 0, margin: 0 }} // Remove padding and margin
            >
              {/* Date and Time */}
              <Typography variant="body1" sx={{ mr: 2 }}>
                {currentDateTime}
              </Typography>
              {/* Logout Button */}
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  border: "1px solid white",
                  padding: 1, // Remove padding
                  minWidth: "auto", // Make the button content fit naturally
                  margin: 0, // Remove margin
                }}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Sidebar state={state} setState={setState} toggleDrawer={toggleDrawer} />
    </Box>
  );
}
export default Navbar;
