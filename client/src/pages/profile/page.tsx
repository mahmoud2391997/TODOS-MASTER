"use client"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
  selectUserProfile,
  selectUserStatus,
  selectUserError,
} from "../../redux/features/user/userSlice";
import { AppDispatch } from "../../redux/store";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectUserProfile);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Populate form fields when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePasswords = () => {
    let isValid = true;
    const newErrors = { password: "", confirmPassword: "" };

    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update profile info if changed
      if (formData.name !== user?.name || formData.email !== user?.email || formData.phone !== user?.phone) {
        await dispatch(updateUserProfile({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })).unwrap();
      }

      // Change password if all password fields are filled
      if (formData.currentPassword && formData.newPassword && formData.confirmPassword) {
        if (!validatePasswords()) return;
        
        await dispatch(changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })).unwrap();

        // Clear password fields after successful change
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      }

      navigate("/dashboard");
    } catch (err) {
      // Errors are handled by Redux and displayed automatically
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box 
        component="header"
        sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 2,
          height: 56,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Button 
          startIcon={<ArrowBack />}
          onClick={() => navigate("/dashboard")}
          sx={{ textTransform: 'none', color: 'text.primary' }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Box 
        component="main"
        sx={{ 
          flex: 1,
          py: 4,
          maxWidth: 'md',
          mx: 'auto',
          width: '100%',
          px: 2
        }}
      >
        <Card>
          <CardHeader
            title="Profile Settings"
            titleTypographyProps={{ variant: 'h4', component: 'h1' }}
            subheader="Update your account information"
          />
          
          <form onSubmit={handleSubmit}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {status === 'loading' && !user ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TextField
                    name="name"
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiInputBase-input': { color: 'text.disabled' } }}
                    required
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    name="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>
                    Change Password
                  </Typography>

                  <TextField
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    name="newPassword"
                    label="New Password"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password}
                  />

                  <TextField
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />
                </>
              )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate("/dashboard")}
                sx={{ mr: 2 }}
                disabled={status === 'loading'}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardActions>
          </form>
        </Card>
      </Box>
    </Box>
  );
}