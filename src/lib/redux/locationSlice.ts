import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { IpAPIResponse, UserLocation } from "@/types";
import { formatUserLocation, getErrorFromAPI } from "../format";

export const fetchLocation = createAsyncThunk(
  "location/fetchLocation",
  async () => {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      const message = await getErrorFromAPI(
        response,
        "Failed to fetch location by ip"
      );
      throw new Error(message);
    }
    const data: IpAPIResponse = await response.json();
    const formattedData = formatUserLocation(data);
    return formattedData;
  }
);

interface LocationState {
  data: UserLocation | null;
  loading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  data: null,
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    resetLocation(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLocation.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchLocation.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch location";
    });
  },
});

export const { resetLocation } = locationSlice.actions;
export default locationSlice.reducer;
