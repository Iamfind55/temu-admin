import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
    message: string | null;
}

const initialState: NotificationState = {
    message: null,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        showNotification: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        hideNotification: (state) => {
            state.message = null;
        },
    },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
