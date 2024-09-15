import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL, DOMAIN } from './config/apiEndPoints';

export const fetchData = createAsyncThunk('data/fetchData', async (_, { getState }) => {
    const { nextUrl } = getState().data;
    let allData = [];
    let currentUrl = nextUrl ?? BASE_URL;
    const transformFields = (record) => {
        return {
            id: record._id,
            name: record["MAHAL ADI"],
            district: record.ILCE,
            type: record.TUR,
            coordinates: record['KOORDINAT\n(Yatay , Dikey)'].split(',').map(coord => parseFloat(coord.trim()))
        };
    };

    while (currentUrl) {
        try {
            const { data } = await axios.get(currentUrl);
            const jsonData = data.contents ? JSON.parse(data.contents) : data;
            const payload = jsonData.result?.records ?? [];
            if (!jsonData.result || !Array.isArray(payload) || payload.length === 0) {
                break;
            }
            const transformedPayload = payload.map(transformFields);
            allData = [...allData, ...transformedPayload];
            currentUrl = jsonData.result._links?.next ? `${DOMAIN}${jsonData.result._links.next}` : null;
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            throw error;
        }
    }

    return allData;
});

export const updateFeature = createAsyncThunk('data/updateFeature', async ({ id, updatedProperties }) => {
    try {
        return { id, updatedProperties };
    } catch (error) {
        console.error('Güncelleme hatası:', error);
        throw error;
    }
});

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        data: [],
        nextUrl: null,
        maxHeight: '480px',
        loading: false,
        error: null,
        activePopup: {
            isActive: false,
            data: {},
        },
        mapState: {
            selectedBaseMap: 'Google',
            filteredData: [],
            isPanelOpen: false,
        },
        snackbar: {
            isOpen: false,
            message: '',
            severity: 'success',
        }
    },
    reducers: {
        closePopup: (state) => {
            state.activePopup.isActive = false;
            state.activePopup.data = {};
        },
        openPopup: (state, action) => {
            state.activePopup.isActive = true;
            state.activePopup.data = action.payload;
        },
        setActivePopup: (state, action) => {
            state.activePopup = action.payload
        },
        setMaxHeight: (state, action) => {
            state.maxHeight = action.payload
        },
        setSnackbar: (state, action) => {
            state.snackbar = action.payload
        },
        setMapState: (state, action) => {
            state.mapState = action.payload
        },
        setSnackbar(state, action) {
            state.snackbar = { ...state.snackbar, ...action.payload };
        },
        setMapState(state, action) {
            state.mapState = { ...state.mapState, ...action.payload };
        },
    },


    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchData.fulfilled, (state, { payload }) => {
                state.data = payload;
                state.loading = false;
            })
            .addCase(fetchData.rejected, (state, { error }) => {
                state.loading = false;
                state.error = error.message;
            })
            .addCase(updateFeature.fulfilled, (state, action) => {
                const { id, updatedProperties } = action.payload;
                const index = state.data.findIndex(feature => feature.id === id);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...updatedProperties };
                }
            })
            .addCase(updateFeature.rejected, (state, action) => {
                state.error = action.error.message;
            });
        ;
    },
});

export const {
    setMap,
    setPopup,
    setSelectedFeature,
    setSelectedBaseMap,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
    setFilteredData,
    setIsPanelOpen,
    setFilterParameter,
    setIsFeatureSelected,
    setActivePopup,
    setMapState,
    setSnackbar,
    closePopup,
    openPopup,
    setMaxHeight
} = dataSlice.actions;

export default dataSlice.reducer;
