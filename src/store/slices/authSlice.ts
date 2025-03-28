import { User } from "@/types/user.types";
import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    status: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    status: null,
}

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (creadentials: { email: string, password: string}) => {
        try {
            const response = await axios.post('/api/users/login', creadentials);
            return response.data;

        } catch (error) {
            return isRejectedWithValue(error.response?.data?.message || "Login failed");
        }
    }
)

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (creadentials: { name: string, email: string, password: string}) => {
        try {
            const response = await axios.post('/api/users/register', creadentials);
            return response.data;
        } catch (error) {
            return isRejectedWithValue(error.response?.data?.message || "Registration failed");
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.status = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.type === "error") {
                state.status = "error";
                toast.error(action.payload.message);
            } else {
                state.user = action.payload.user;
                state.token = action.payload.access_token;
                state.status = "success";
                toast.success(action.payload.message);
            }
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.type === "error") {
                state.status = "error";
                toast.error(action.payload.message);
            } else {
                state.user = action.payload.user;
                state.token = action.payload.access_token;
                state.status = "success";
                toast.success(action.payload.message);
            }
        })
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;