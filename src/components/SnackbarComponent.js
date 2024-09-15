import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from '../dataSlice';

const SnackbarComponent = () => {
    const dispatch = useDispatch();
    const { snackbar } = useSelector((state) => state.data);

    const handleSnackbarClose = () => {
        dispatch(setSnackbar({
            isOpen: false,
        }));
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={snackbar.isOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
        >
            <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarComponent;
