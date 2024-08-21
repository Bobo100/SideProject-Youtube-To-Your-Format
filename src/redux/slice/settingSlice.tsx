// component/redux/slice/settingSlice.tsx
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { settingInitialState, SettingState } from "../state/stateType"
import { RootState } from "../store/store"

export const settingSlice = createSlice({
    name: 'settingData',
    initialState: settingInitialState,
    reducers: {
        setSettingModalOpen: (state, action: PayloadAction<boolean>) => {
            state.open = action.payload
        }

    },
})
export const { setSettingModalOpen } = settingSlice.actions

export const reduxSettingData = (state: RootState) => state.settingData

export default settingSlice.reducer