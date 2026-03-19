import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

export type ActivityStatus = 'active' | 'inactive';
export type ConnectionStatus = 'connected' | 'disconnected';

export interface DeviceItem {
  id: number;
  code: string;
  name: string;
  ip: string;
  activityStatus: ActivityStatus;
  connectionStatus: ConnectionStatus;
  activityLabel?: string;
  connectionLabel?: string;
  services: string[];
}

export type NewDevicePayload = Omit<DeviceItem, 'id'>;

interface DevicesState {
  items: DeviceItem[];
  loading: boolean;
  error?: string;
}

const initialState: DevicesState = {
  items: [],
  loading: false,
  error: undefined,
};

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const fetchDevices = createAsyncThunk<DeviceItem[], void, { rejectValue: string }>(
  'devices/fetchAll',
  async (_, { rejectWithValue }) => {
    const normalizeText = (value: string) =>
      (value || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();

    const normalizeActivity = (value: string): ActivityStatus => {
      const v = normalizeText(value);
      if (v.includes('ngung') || v.includes('nghi') || v.includes('khong hoat')) {
        return 'inactive';
      }
      if (v.includes('active') || v.includes('hoat dong')) {
        return 'active';
      }
      return 'inactive';
    };

    const normalizeConnection = (value: string): ConnectionStatus => {
      const v = normalizeText(value);
      if (v.includes('mat ket') || v.includes('disconnected')) {
        return 'disconnected';
      }
      if (v.includes('connected') || v.includes('ket noi')) {
        return 'connected';
      }
      return 'disconnected';
    };

    try {
      const response = await fetch(`${API_BASE}/devices`);

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(
          `Mock API responded with status ${response.status}. Body: ${errorText || 'No content'}`,
        );
      }

      const raw = await response.text();
      try {
        const parsed = JSON.parse(raw) as DeviceItem[];
        return parsed.map((item) => ({
          ...item,
          activityStatus: normalizeActivity((item as any).activityStatus),
          connectionStatus: normalizeConnection((item as any).connectionStatus),
          activityLabel: (item as any).activityStatus,
          connectionLabel: (item as any).connectionStatus,
        }));
      } catch (parseError) {
        return rejectWithValue('Mock API returned invalid JSON. Check db.json and server.js.');
      }
    } catch (networkError) {
      return rejectWithValue(
        'Cannot reach mock API. Please start json-server (npm run mock-api) on port 3001.',
      );
    }
  },
);

export const createDevice = createAsyncThunk<DeviceItem, NewDevicePayload, { rejectValue: string }>(
  'devices/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(
          `Mock API responded with status ${response.status}. Body: ${errorText || 'No content'}`,
        );
      }

      const raw = await response.text();
      try {
        return JSON.parse(raw) as DeviceItem;
      } catch (parseError) {
        return rejectWithValue('Mock API returned invalid JSON for POST /devices.');
      }
    } catch (networkError) {
      return rejectWithValue(
        'Cannot reach mock API. Please start json-server (npm run mock-api) on port 3001.',
      );
    }
  },
);

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    addDevice: (state, action: PayloadAction<DeviceItem>) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch devices';
      })
      .addCase(createDevice.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createDevice.rejected, (state, action) => {
        state.error = action.payload || action.error.message || 'Failed to create device';
      });
  },
});

export const selectDevices = (state: RootState) => state.devices.items;
export const selectDevicesLoading = (state: RootState) => state.devices.loading;
export const selectDevicesError = (state: RootState) => state.devices.error;

export const { addDevice } = devicesSlice.actions;
export default devicesSlice.reducer;
