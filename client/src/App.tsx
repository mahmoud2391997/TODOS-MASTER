import { Link } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,

  Paper,
  useTheme,
  CssBaseline
} from "@mui/material";

export function Home() {
  const theme = useTheme();



  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            TODOS MASTER
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={Link} to="/login" sx={{ color: 'black' }}>
              Login
            </Button>
            <Button component={Link} to="/register" variant="contained" sx={{ backgroundColor: 'black', color: 'white' }}>
              Register
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero Section */}
        <Box sx={{
          py: { xs: 8, md: 12, lg: 16 },
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(180deg, #121212 0%, #1E1E1E 100%)' 
            : 'linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)'
        }}>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' }
                }}
              >
                Organize Your Activities with TODOS MASTER
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: 700,
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                The simple, effective way to manage your tasks and boost productivity.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button 
                  component={Link} 
                  to="/register" 
                  variant="contained" 
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ px: 4, py: 1.5, background: 'black' }}
                >
                  Get Started
                </Button>
                <Button 
                  component={Link} 
                  to="/login" 
                  variant="outlined" 
                  size="large"
                  sx={{ px: 4, py: 1.5 ,color:"black",border:"1px solid black"}}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Features Section */}

      </Box>

      {/* Footer */}
      <Paper component="footer" sx={{ py: 4, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 2
          }}>
            <Typography variant="body2" color="text.secondary">
              © 2025 TaskMaster. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button component={Link} to="#" size="small" color="inherit">
                Terms of Service
              </Button>
              <Button component={Link} to="#" size="small" color="inherit">
                Privacy
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
}
// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/authentication/registerPage';
import LoginPage from './pages/authentication/loginPage'
import DashboardPage from './pages/todosList/page'
import ProfilePage from './pages/profile/page'
import ProtectedRoute from './pages/protectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/login"
        element={
            <LoginPage />
        }
      />
      <Route path="/dashboard" element={
                          <ProtectedRoute>

                            <DashboardPage />
                          </ProtectedRoute>

      }
         />
      <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>} />
    </Routes>
  );
}

export default App;
