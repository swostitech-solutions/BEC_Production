
import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Grid,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import { ApiUrl } from "../ApiUrl";
import { useTheme } from "@mui/material/styles";

function Navbar({ onLogout }) {
  const [state, setState] = React.useState({ left: false });
  const [currentDateTime, setCurrentDateTime] = React.useState("");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
      setCurrentDateTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/login";
    }
  };


 return (
   <Box sx={{ flexGrow: 1 }}>
     <AppBar position="static">
       <Toolbar>
         <Grid container alignItems="center" justifyContent="space-between">
           {/* Sidebar toggle icon - Left */}
           <Grid item xs="auto">
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
           </Grid>

          

           {/* Time & Logout - Right */}
           <Grid item xs="auto">
             <Box
               sx={{
                 display: "flex",
                 alignItems: "center",
                 gap: 2,
                 flexWrap: "wrap",
               }}
             >
               <Typography variant="body2" sx={{ color: "#fff" }}>
                 {currentDateTime}
               </Typography>
               <Button
                 color="inherit"
                 onClick={handleLogout}
                 sx={{
                   border: "1px solid white",
                   padding: "4px 12px",
                   fontSize: "0.875rem",
                 }}
               >
                 Logout
               </Button>
             </Box>
           </Grid>
         </Grid>
       </Toolbar>
     </AppBar>

     {/* Sidebar Drawer */}
     <Sidebar state={state} setState={setState} toggleDrawer={() => {}} />
   </Box>
 );

}

export default Navbar;

