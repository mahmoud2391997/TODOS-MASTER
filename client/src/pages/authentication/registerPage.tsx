// src/pages/RegisterPage.tsx
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import { registerUser } from "../../redux/features/auth/authSlice.ts";
import { AppDispatch, RootState } from "../../redux/store.ts";

// Validation schema using yup
const schema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  phone: yup
    .string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Phone Number is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export interface AuthState {
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed"; // Ensure status is defined
  user: any | null; // Add other properties as needed to match your Redux state
  // Ensure the Redux state matches this structure
}

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Get auth state from Redux
  const { status, error } = useSelector((state: RootState) => state.auth);

  // Initialize react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    const { name, email, password ,phone} = data;

    // Dispatch register action
    const result = await dispatch(registerUser({ name, email, password ,phone}));

    // If registration was successful, redirect to dashboard
    if (registerUser.fulfilled.match(result)) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardHeader
          title="Create an account"
          titleTypographyProps={{ variant: "h4", component: "h1" }}
          subheader="Enter your information to create an account"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Show error message if any */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  placeholder="John Doe"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  placeholder="+1234567890"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  placeholder="m@example.com"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />
          </CardContent>
          <CardActions sx={{ flexDirection: "column", p: 3, gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={status === "loading"}
              size="large"
              sx={{ background: "black" }}
            >
              {status === "loading" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
            <Typography variant="body2" color="text.secondary" align="center">
              Already have an account?{" "}
              <MuiLink
                component={Link}
                to="/login"
                sx={{ textDecoration: "none", color: "black" }}
              >
                Login
              </MuiLink>
            </Typography>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
}