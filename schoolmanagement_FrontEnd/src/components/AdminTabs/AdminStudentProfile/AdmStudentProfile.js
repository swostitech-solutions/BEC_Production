import React, { useState } from 'react';
import Link from '@mui/material/Link';
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  CssBaseline,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
//   Link,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const StudentProfileForm = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [name, setName] = useState('');
  const [classValue, setClassValue] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [section, setSection] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [email, setEmail] = useState('');
  const [alternativeContact, setAlternativeContact] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  const handleProfilePictureChange = (e) => {
    // Handle profile picture upload logic here
    const file = e.target.files[0];
    setProfilePicture(URL.createObjectURL(file));
  };
  const handleToggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const handleResetPasswordClick = () => {
    setResetPasswordOpen(true);
  };

  const handleResetPasswordClose = () => {
    setResetPasswordOpen(false);
  }; 

  const handleResetPasswordSubmit = () => {
    // Add logic to handle password reset here
    // Check if currentPassword is correct
    // Check if newPassword matches confirmNewPassword
    // If conditions are met, update the password and close the dialog
    // Otherwise, display an error message
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    if (currentPassword === 'actualCurrentPassword' && newPassword === confirmNewPassword) {
        // Update password logic here
        alert('Password has been reset successfully.');
      } else {
        alert('Invalid current password or new password mismatch.');
      }
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box sx={{ marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <AddAPhotoIcon />
        </Avatar>
        <Typography component="h1" variant="h6">
          Student Profile
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 0}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
          size="small"
                
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Class"
                value={classValue}
                onChange={(e) => setClassValue(e.target.value)}
          size="small"

                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
          size="small"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
          size="small"

                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Parent's Contact Number"
                value={parentContact}
                onChange={(e) => setParentContact(e.target.value)}
          size="small"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
          size="small"

                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alternative Contact Number"
                value={alternativeContact}
                onChange={(e) => setAlternativeContact(e.target.value)}
          size="small"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                value={address}
                onChange={(e) => setAddress(e.target.value)}
          size="small"
          placeholder="Placeholder"
     
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={gender}
                  label="Gender"
                  onChange={(e) => setGender(e.target.value)}
                //   defaultValue="Small"
          size="small"
                  required
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <input type="file" onChange={handleProfilePictureChange} accept="image/*" />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '16px',}}>
            Save 
          </Button>
    
        </form>
      
        <Link variant="body2" onClick={handleResetPasswordClick}>
          Reset Password
        </Link>

        <Dialog open={resetPasswordOpen} onClose={handleResetPasswordClose}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              margin="normal"
              
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleCurrentPasswordVisibility}>
                      {showCurrentPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleNewPasswordVisibility}>
                      {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmNewPassword ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleConfirmNewPasswordVisibility}>
                      {showConfirmNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button onClick={handleResetPasswordSubmit} variant="contained" color="primary">
              Reset Password
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};

export default StudentProfileForm;
