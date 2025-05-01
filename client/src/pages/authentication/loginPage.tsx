// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { loginUser } from "../../redux/features/auth/authSlice";
import { AppDispatch, RootState } from "../../redux/store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic client-side validation
    let isValid = true;
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    // Dispatch login action
    const result = await dispatch(loginUser({ email, password }));
    
    // If login was successful, redirect to dashboard
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        backgroundColor: '#f5f5f5' // Light gray background
      }}
    >
      <Card sx={{ 
        maxWidth: 400, 
        width: '100%',
        boxShadow: 3,
        borderRadius: 2
      }}>
        <CardHeader
          title="Login"
          titleTypographyProps={{ 
            variant: 'h4', 
            component: 'h1',
            fontWeight: 'bold',
          }}
          subheader="Enter your email and password to access your account"
          sx={{ textAlign: 'center', pt: 4, color:"black" }}
        />
        <form onSubmit={handleSubmit}>
          <CardContent sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            px: 4,
            pt: 2
          }}>
            {/* Show error message if any */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              id="email"
              label="Email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!emailError}
              helperText={emailError}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!passwordError}
              helperText={passwordError}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            />
          </CardContent>
          <CardActions sx={{ 
            flexDirection: 'column', 
            p: 3, 
            gap: 2,
            pt: 0
          }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={status === 'loading'}
              size="large"
              sx={{ 
                backgroundColor: 'black',
                color: 'white',
                textTransform: 'none',
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'grey.800',
                }
              }}
            >
              {status === 'loading' ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
            <Typography 
              variant="body2" 
              sx={{
                color: 'grey.600',
                textAlign: 'center',
                mt: 1
              }}
            >
              Don't have an account?{" "}
              <MuiLink
                component={Link}
                to="/register"
                sx={{ 
                  textDecoration: 'none',
                  color: 'black',
                  fontWeight: 'medium',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Register
              </MuiLink>
            </Typography>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
}