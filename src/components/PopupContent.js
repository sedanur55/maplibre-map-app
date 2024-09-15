import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { orange } from '@mui/material/colors';

const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    district: z.string().min(1, { message: "District is required" }),
    type: z.string().min(1, { message: "Type is required" }),
});

const PopupContent = ({ defaultValues, onSaveed }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return (
        <div style={{ width: '130px', padding: '4px', borderRadius: '5px' }}>
            <TextField
                label="Name"
                {...register('name')}
                fullWidth
                color='warning'
                variant="standard"
                size="small"
                margin="dense"
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{
                    width: '100%',
                    fontSize: '0.6rem',
                    '& input': { padding: '2px', fontSize: '0.6rem' }
                }}
            />
            <TextField
                label="District"
                {...register('district')}
                fullWidth
                variant="standard"
                size="small"
                color='warning'
                margin="dense"
                error={!!errors.district}
                helperText={errors.district?.message}
                sx={{
                    width: '100%',
                    fontSize: '0.6rem',
                    '& input': { padding: '2px', fontSize: '0.6rem' }
                }}
            />
            <TextField
                label="Type"
                {...register('type')}
                fullWidth
                variant="standard"
                size="small"
                margin="dense"
                color='warning'
                error={!!errors.type}
                helperText={errors.type?.message}
                sx={{
                    width: '100%',
                    fontSize: '0.6rem',
                    '& input': { padding: '2px', fontSize: '0.6rem' }
                }}
            />
            <Box display="flex" justifyContent="center" marginTop={1}>
                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        padding: '2px 4px',
                        fontSize: '0.5rem',
                        minWidth: '50px',
                        backgroundColor: orange[500]
                    }}
                    onClick={handleSubmit((data) => {
                        onSaveed(data);
                    })}
                >
                    Update
                </Button>
            </Box>
        </div>
    );
};

export default PopupContent;