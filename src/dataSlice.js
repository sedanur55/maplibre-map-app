// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { BASE_URL } from './config/apiEndPoints';

// // Verileri API'den çekmek için async thunk
// export const fetchData = createAsyncThunk('data/fetchData', async (_, { getState }) => {
//     const { nextUrl } = getState().data; // nextUrl al

//     let data;

//     if (nextUrl) {
//         // axios kullanımı
//         const response = await axios.get(nextUrl);
//         data = response.data; // axios otomatik olarak JSON ayrıştırır
//     } else {
//         const response = await fetch(BASE_URL);
//         data = await response.json(); // fetch ile gelen yanıtı manuel olarak ayrıştırmalıyız
//     }

//     return data; // payload, JSON verisini içeriyor
// });v


// const dataSlice = createSlice({
//     name: 'data',
//     initialState: {
//         data: [],
//         nextUrl: null,
//         loading: false,
//         error: null,
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchData.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchData.fulfilled, (state, action) => {
//                 const jsonData = JSON.parse(action.payload.contents);
//                 const payload = jsonData.result.records;
//                 console.log('payload', payload);
//                 console.log('payload', action.payload.contents);

//                 if (payload) {
//                     // Veriler mevcutsa
//                     state.data = [...state.data, ...payload];
//                 } else {
//                     console.error('Veri yapısı beklenmedik şekilde:', payload);
//                 }

//                 // nextUrl'yi güncelle
//                 state.nextUrl = jsonData.result._links?.next ? `https://data.ibb.gov.tr${jsonData.result._links.next}` : null;
//                 state.loading = false;
//                 console.log('state.nextUrl', state.nextUrl);
//                 console.log('state.nextUrlaction.payload.contents._links', jsonData.result._links);
//             })
//             .addCase(fetchData.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             });
//     },
// });

// export default dataSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchJsonp from 'fetch-jsonp';
import { BASE_URL } from './config/apiEndPoints';

// Verileri API'den çekmek için async thunk
export const fetchData = createAsyncThunk(
    'users/fetchById',
    async (thunkAPI) => {

        console.log('sss')
        const { nextUrl } = getState().data; // nextUrl al
        let allData = [];
        let currentUrl = nextUrl || BASE_URL;

        while (currentUrl) {
            try {
                // Veri çekme
                console.log('currentUrl', currentUrl);
                // const response = await fetchJsonp(currentUrl);
                const response = await fetch(currentUrl, {
                    signal: thunkAPI.signal,
                })
                const jsonData = await response.json(); // JSONP'den JSON'a çevir
                console.log('response', response);
                console.log('jsonData', jsonData);
                const payload = jsonData.result.records;

                if (!jsonData.result || !Array.isArray(jsonData.result.records) || jsonData.result.records.length === 0) {
                    break;
                }
                if (payload) {
                    allData = [...allData, ...payload];
                } else {
                    console.error('Veri yapısı beklenmedik şekilde:', payload);
                }

                // nextUrl'yi güncelle
                currentUrl = jsonData.result._links?.next ? `https://data.ibb.gov.tr${jsonData.result._links.next}` : null;
                console.log('currentUrl', currentUrl);
            } catch (error) {
                console.error('Veri çekme hatası:', error);
                throw error; // Hata oluşursa reject edelim
            }
        }

        return allData; // Tüm verileri döndür
    });

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        data: [],
        nextUrl: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default dataSlice.reducer;
