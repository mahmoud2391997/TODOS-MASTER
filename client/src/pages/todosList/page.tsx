"use client";
import TodoItem from "../../components/todoItem";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Box,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { AddCircle, Person, ExitToApp, Search } from "@mui/icons-material";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  selectTodos,
  selectTodosStatus,
  selectTodosError,
} from "../../redux/features/todo/todoSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { Todo } from "../../redux/features/todo/todoSlice";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const todos = useSelector<RootState, Todo[]>(selectTodos);
  const status = useSelector<RootState, string>(selectTodosStatus);
  const error = useSelector<RootState, string | null>(selectTodosError);
  
  const [newTodoDialogOpen, setNewTodoDialogOpen] = useState(false);
  const [newTodoData, setNewTodoData] = useState<Omit<Todo, 'id' | 'createdAt'>>({
    title: "",
    description: "",
    status: "pending",
    dueDate: new Date(),
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");
  const [searchBy, setSearchBy] = useState<"title" | "description">("title");

  // Fetch todos on component mount
  useEffect(() => {
    dispatch(fetchTodos({}));
  }, [dispatch]);

  const handleOpenNewTodoDialog: () => void = () => {
    setNewTodoDialogOpen(true);
  };

  const handleCloseNewTodoDialog = () => {
    setNewTodoDialogOpen(false);
    setNewTodoData({
      title: "",
      description: "",
      status: "pending",
      dueDate: new Date(),
    });
  };

  const handleNewTodoChange = (field: keyof typeof newTodoData, value: any) => {
    setNewTodoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTodo = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await dispatch(createTodo(newTodoData)).unwrap();
      await dispatch(fetchTodos({}));
      handleCloseNewTodoDialog();
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const toggleTodo = async (id: string): Promise<void> => {
    const todo = todos?.find((t) => t._id === id);
    if (todo) {
      await dispatch(
        updateTodo({
          id,
          updates: { 
            status: todo.status === "completed" ? "pending" : "completed" 
          },
        })
      );
      await dispatch(fetchTodos({}));

    }
  };

  const deletingTodo = async (id: string): Promise<void> => {
    await dispatch(deleteTodo(id));
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Filter and search todos
  const filteredTodos = todos?.filter(todo => {
    // Filter by status
    if (filterStatus !== "all" && todo.status !== filterStatus) {
      return false;
    }
    
    // Search by term
    if (searchTerm) {
      const searchField = searchBy === "title" ? todo.title : todo.description || "";
      return searchField.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  const completedCount = todos?.filter((t) => t.status === "completed").length;
  const totalCount = todos?.length;
  const filteredCompletedCount = filteredTodos?.filter((t) => t.status === "completed").length;
  const filteredTotalCount = filteredTodos?.length;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            TODOS MASTER
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                component={Link}
                to="/profile"
                startIcon={<Person />}
                sx={{ textTransform: "none", color: "black" }}
              >
                Profile
              </Button>
              <Button
                onClick={handleLogout}
                startIcon={<ExitToApp />}
                sx={{ textTransform: "none", color: "red" }}  
              >
                Logout
              </Button>
            </Box>
        </Toolbar>
      </AppBar>

        <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" component="h1">
              My TODOS
            </Typography>
            <Chip
              label={`${filteredCompletedCount}/${filteredTotalCount} completed`}
              color="info"
              variant="outlined"
            />
          </Box>

          {/* Search and Filter Controls */}
          <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
            <TextField
              placeholder={`Search by ${searchBy}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "action.active" }} />,
              }}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            
            <ToggleButtonGroup
              value={searchBy}
              exclusive
              onChange={(_, newSearchBy) => {
              if (newSearchBy !== null) {
                setSearchBy(newSearchBy);
              }
              }}
              aria-label="search by"
              size="small"
            >
              <ToggleButton value="title" aria-label="search by title">
              Title
              </ToggleButton>
              <ToggleButton value="description" aria-label="search by description">
              Description
              </ToggleButton>
            </ToggleButtonGroup>
            
            <ToggleButtonGroup
              value={filterStatus}
              exclusive
              onChange={(_, newFilter) => {
              if (newFilter !== null) {
                setFilterStatus(newFilter);
              }
              }}
              aria-label="filter by status"
              size="small"
            >
              <ToggleButton value="all" aria-label="all tasks">
              All
              </ToggleButton>
              <ToggleButton value="pending" aria-label="pending tasks">
              Pending
              </ToggleButton>
              <ToggleButton value="completed" aria-label="completed tasks">
              Completed
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              color="success"
              onClick={handleOpenNewTodoDialog}
              sx={{ ml: "auto" }}
            >
              Add Task
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Paper elevation={2}>
            {status === "loading" && todos?.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <CircularProgress />
              </Box>
            ) : filteredTodos?.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography color="text.secondary">
                  {todos?.length === 0 ? "No tasks yet. Add one above!" : "No tasks match your search criteria"}
                </Typography>
              </Box>
            ) : (
              <Box>
                {filteredTodos?.map((todo) => (
                  <TodoItem
                    key={todo._id}
                    todo={{
                      ...todo,
                      id: todo._id,
                      status: todo.status || "pending",
                      dueDate: todo.dueDate || new Date(),
                      createdAt: todo.createdAt || new Date(),
                      description: todo.description || "",
                    }}
                    onToggle={() => toggleTodo(todo._id)}
                    onDelete={() => deletingTodo(todo._id)}
                    onUpdate={async (updatedTodo)  => {
                     await dispatch(
                        updateTodo({
                          id: todo._id,
                          updates: updatedTodo,
                        })
                      );
                      await dispatch(fetchTodos({}));

                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Container>

        {/* New Todo Dialog */}
        <Dialog open={newTodoDialogOpen} onClose={handleCloseNewTodoDialog} fullWidth maxWidth="sm">
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                label="Title"
                value={newTodoData.title}
                onChange={(e) => handleNewTodoChange('title', e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Description"
                value={newTodoData.description}
                onChange={(e) => handleNewTodoChange('description', e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={newTodoData.status}
                  label="Status"
                  onChange={(e) => handleNewTodoChange('status', e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <DatePicker
                label="Due Date"
                value={newTodoData.dueDate}
                onChange={(date) => handleNewTodoChange('dueDate', date)}
                sx={{ mt: 2, width: '100%' }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewTodoDialog}>Cancel</Button>
            <Button 
              onClick={addTodo} 
              variant="contained"
              disabled={!newTodoData.title.trim()}
            >
              Add Task
            </Button>
          </DialogActions>
        </Dialog>

        <Box
          component="footer"
          sx={{
            py: 3,
            borderTop: 1,
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            TaskMaster © 2025 - All rights reserved
          </Typography>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}