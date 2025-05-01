"use client"

import { useState } from "react";
import {
  Box,
  Checkbox,
  TextField,
  IconButton,
  Typography,
  Paper,
  useTheme,
  Chip,
  Collapse,
  Divider,
  Stack,
  Button
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon
} from "@mui/icons-material";
import { format } from "date-fns";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: "completed" | "pending";
  dueDate: Date;
  createdAt: Date;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (updatedTodo: Partial<Todo>) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState({
    title: todo.title,
    description: todo?.description,
    dueDate: format(new Date(todo?.dueDate || "1970-01-01"), "yyyy-MM-dd")
  });
  const theme = useTheme();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTodo({
      title: todo.title,
      description: todo.description,
      dueDate: format(new Date(todo.dueDate), "yyyy-MM-dd")
    });
  };

  const handleSave = () => {
    if (editedTodo.title.trim()) {
      onUpdate({
        title: editedTodo.title,
        description: editedTodo.description,
        dueDate: new Date(editedTodo.dueDate)
      });
      setIsEditing(false);
    }
  };

  const handleFieldChange = (field: keyof typeof editedTodo, value: string) => {
    setEditedTodo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mb: 2,
        bgcolor: todo.status === 'completed' ? 
          theme.palette.mode === 'dark' ? 'background.default' : 'grey.100' : 
          'background.paper',
        borderLeft: todo.status === 'completed' ? '4px solid' : '4px solid',
        borderColor: todo.status === 'completed' ? 'success.main' : 'warning.main'
      }}
    >
      {isEditing ? (
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={editedTodo.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              fullWidth
              autoFocus
              size="small"
              required
            />
            <TextField
              label="Description"
              value={editedTodo.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
              size="small"
            />
            <TextField
              label="Due Date"
              type="date"
              value={editedTodo.dueDate}
              onChange={(e) => handleFieldChange('dueDate', e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button 
                variant="outlined" 
                onClick={handleCancel}
                startIcon={<CloseIcon />}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSave}
                startIcon={<CheckIcon />}
                disabled={!editedTodo.title.trim()}
              >
                Save
              </Button>
            </Box>
          </Stack>
        </Box>
      ) : (
        <>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              p: 2,
              cursor: 'pointer'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Checkbox
                checked={todo.status === 'completed'}
                onChange={onToggle}
                color="primary"
              />
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                    fontWeight: 'medium'
                  }}
                >
                  {todo.title}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip
                    label={todo.status}
                    size="small"
                    color={todo.status === 'completed' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                  <Chip
                    icon={<CalendarIcon fontSize="small" />}
                    label={format(new Date(todo?.dueDate || "1970-01-01"), "yyyy-MM-dd")}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
           
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                size="small"
                color="primary"
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Collapse in={true}>
            <Divider />
            <Box sx={{ p: 2 }}>
              {todo.description && (
                <Typography variant="body2" paragraph>
                  {todo.description}
                </Typography>
              )}
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  <TimeIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  Created: {format(new Date(todo.createdAt), "MMM dd, yyyy")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <CalendarIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  Due: {format(new Date(todo?.dueDate || "1970-01-01"), "yyyy-MM-dd")}
                </Typography>
              </Stack>
            </Box>
          </Collapse>
        </>
      )}
    </Paper>
  );
}