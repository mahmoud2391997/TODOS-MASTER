import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
const api = "http://localhost:3000"

// Types
export interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  [key: string]: any;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Filters {
  status: string;
  search: string;
  tags: string[];
}

interface Sort {
  field: string;
  order: 'asc' | 'desc';
}

interface TodosState {
  items: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: Pagination;
  filters: Filters;
  sort: Sort;
}

interface FetchTodosResponse {
  data: Todo[];
  pagination: Pagination;
}

interface BulkUpdateResponse {
  updatedIds: string[];
  updates: Partial<Todo>;
}

// Initial State
const initialState: TodosState = {
  items: [],
  status: 'idle',
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  filters: {
    status: '',
    search: '',
    tags: [],
  },
  sort: {
    field: 'createdAt',
    order: 'desc',
  },
};

// Async Thunks
export const fetchTodos = createAsyncThunk<FetchTodosResponse, Record<string, any>, { state: RootState }>(
  'todos/fetchTodos',
  async (params, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${api}/api/todos`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTodo = createAsyncThunk<Todo, Partial<Todo>, { state: RootState }>(
  'todos/createTodo',
  async (todoData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${api}/api/todos`, todoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTodo = createAsyncThunk<Todo, { id: string; updates: Partial<Todo> }, { state: RootState }>(
  'todos/updateTodo',
  async ({ id, updates }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`${api}/api/todos/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk<string, string, { state: RootState }>(
  'todos/deleteTodo',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${api}/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const bulkUpdateTodos = createAsyncThunk<BulkUpdateResponse, { ids: string[]; updates: Partial<Todo> }, { state: RootState }>(
  'todos/bulkUpdate',
  async ({ ids, updates }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.patch(`${api}/api/todos/bulk-update` ,{ ids, updates }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSort: (state, action: PayloadAction<Sort>) => {
      state.sort = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<Pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearTodosError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Todos
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Create Todo
      .addCase(createTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Update Todo
      .addCase(updateTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(todo => todo._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Delete Todo
      .addCase(deleteTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(todo => todo._id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Bulk Update
      .addCase(bulkUpdateTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(bulkUpdateTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedIds = action.payload.updatedIds;
        state.items = state.items.map(todo => {
          if (updatedIds.includes(todo._id)) {
            return { ...todo, ...action.payload.updates };
          }
          return todo;
        });
      })
      .addCase(bulkUpdateTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setSort, setPagination, clearTodosError } = todosSlice.actions;
export default todosSlice.reducer;

// Selectors
export const selectTodos = (state: RootState) => state.todos.items;
export const selectTodosStatus = (state: RootState) => state.todos.status;
export const selectTodosError = (state: RootState) => state.todos.error;